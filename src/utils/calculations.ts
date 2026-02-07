import { CalculatorInputs, CalculationResults, IncomeBreakdown, BankRecommendation, CoApplicantData } from '../types';
import { SupabaseBankProfile } from '../lib/supabase';

const STANDARD_INTEREST_RATE = 4.5;
const GOVERNMENT_INTEREST_RATE = 4.0;
const BEST_INTEREST_RATE = 4.2;
const MEDIUM_INTEREST_RATE = 4.35;
const DOWN_PAYMENT_PERCENTAGE = 10;
const MAX_DSR_PERCENTAGE = 70;
const LPPSA_MAX_DSR_PERCENTAGE = 60;
const LOW_INCOME_DSR_PERCENTAGE = 60;
const INCOME_THRESHOLD = 3000;
const EPF_DEDUCTION_RATE = 11;
const LPPSA_MULTIPLIER = 175;
const BANK_MULTIPLIER = 190;

const BANK_BONUS_PERCENTAGE = 50;
const BANK_PASSIVE_INCOME_PERCENTAGE = 70;
const BANK_DIVIDEND_PERCENTAGE = 100;
const BANK_COMMISSION_PERCENTAGE = 75;

const HLB_HIGH_INCOME_THRESHOLD = 10000;
const HLB_HIGH_INCOME_DSR = 80;

export function getMaxDSRPercentage(netIncome: number, useLPPSA: boolean): number {
  if (useLPPSA) {
    return LPPSA_MAX_DSR_PERCENTAGE;
  }

  if (netIncome < INCOME_THRESHOLD) {
    return LOW_INCOME_DSR_PERCENTAGE;
  }

  return MAX_DSR_PERCENTAGE;
}

export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = years * 12;

  if (monthlyRate === 0) return principal / totalMonths;

  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  return payment;
}

export function calculateMaxLoanFromPayment(
  monthlyPayment: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = years * 12;

  if (monthlyRate === 0) return monthlyPayment * totalMonths;

  const principal =
    (monthlyPayment * (Math.pow(1 + monthlyRate, totalMonths) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, totalMonths));

  return principal;
}

export function calculateAverageInterestRate(banks: SupabaseBankProfile[], employmentType: string): number {
  if (!banks || banks.length === 0) {
    return employmentType === 'Government Employee' ? GOVERNMENT_INTEREST_RATE : STANDARD_INTEREST_RATE;
  }

  const eligibleBanks = banks.filter(bank =>
    bank.primary_focus?.includes(employmentType) || bank.secondary_focus?.includes(employmentType)
  );

  if (eligibleBanks.length === 0) {
    return employmentType === 'Government Employee' ? GOVERNMENT_INTEREST_RATE : STANDARD_INTEREST_RATE;
  }

  const totalAvg = eligibleBanks.reduce((sum, bank) => {
    return sum + (bank.interest_rate_min + bank.interest_rate_max) / 2;
  }, 0);

  return totalAvg / eligibleBanks.length;
}

function calculateBestInterestRate(banks: SupabaseBankProfile[]): number {
  if (!banks || banks.length === 0) {
    return BEST_INTEREST_RATE;
  }

  const sortedBanks = [...banks].sort((a, b) => a.interest_rate_min - b.interest_rate_min);
  const topBanks = sortedBanks.slice(0, 3);

  if (topBanks.length === 0) {
    return BEST_INTEREST_RATE;
  }

  const avgBestRate = topBanks.reduce((sum, bank) => sum + bank.interest_rate_min, 0) / topBanks.length;
  return avgBestRate;
}

function calculateMediumInterestRate(banks: SupabaseBankProfile[], baseRate: number): number {
  if (!banks || banks.length === 0) {
    return MEDIUM_INTEREST_RATE;
  }

  const bestRate = calculateBestInterestRate(banks);
  return (bestRate + baseRate) / 2;
}

export function calculateInterestRate(savings: number, housePrice: number, employmentType: string, banks: SupabaseBankProfile[] = [], useLPPSA: boolean = false): number {
  if (useLPPSA && employmentType === 'Government Employee') {
    const lppsaBank = banks.find(bank => bank.bank_name === 'LPPSA');
    if (lppsaBank) {
      return (lppsaBank.interest_rate_min + lppsaBank.interest_rate_max) / 2;
    }
    return GOVERNMENT_INTEREST_RATE;
  }

  const baseRate = calculateAverageInterestRate(banks, employmentType);

  if (housePrice === 0) return baseRate;

  const savingsPercentage = (savings / housePrice) * 100;

  if (savingsPercentage >= 10) {
    return calculateBestInterestRate(banks);
  } else if (savingsPercentage >= 5) {
    return calculateMediumInterestRate(banks, baseRate);
  } else {
    return baseRate;
  }
}

function calculateBankScore(
  bank: SupabaseBankProfile,
  employmentType: string,
  dsr: number,
  netIncome: number
): number {
  let score = 0;

  if (bank.primary_focus?.includes(employmentType)) {
    score += 50;
  } else if (bank.secondary_focus?.includes(employmentType)) {
    score += 30;
  }

  if (netIncome >= bank.min_income) {
    score += 30;
  } else {
    score -= 20;
  }

  const isHLB = bank.bank_name === 'Hong Leong Bank';
  const isPBB = bank.bank_name === 'Public Bank';
  const isHighIncome = netIncome >= HLB_HIGH_INCOME_THRESHOLD;
  const maxDSR = ((isHLB || isPBB) && isHighIncome) ? HLB_HIGH_INCOME_DSR : (bank.max_dsr || 70);

  if (dsr <= 40) {
    score += 20;
  } else if (dsr <= 60) {
    score += 14;
  } else if (dsr <= maxDSR) {
    score += 10;
  } else {
    score -= 30;
  }

  if ((isHLB || isPBB) && isHighIncome) {
    score += 40;
  }

  const avgInterestRate = (bank.interest_rate_min + bank.interest_rate_max) / 2;
  if (avgInterestRate < 3.8) {
    score += 10;
  } else if (avgInterestRate < 4.0) {
    score += 5;
  }

  return score;
}

function getBankReasonKey(
  bank: SupabaseBankProfile,
  employmentType: string,
  dsr: number,
  netIncome: number
): string {
  const isPrimaryFocus = bank.primary_focus?.includes(employmentType);
  const isSecondaryFocus = bank.secondary_focus?.includes(employmentType);

  if (employmentType === 'Government Employee' && (isPrimaryFocus || isSecondaryFocus)) {
    return 'governmentEmployee';
  }

  if (employmentType === 'Self Employed' && (isPrimaryFocus || isSecondaryFocus)) {
    return 'selfEmployed';
  }

  if (employmentType === 'Commission Based' && (isPrimaryFocus || isSecondaryFocus)) {
    return 'commissionBased';
  }

  if (employmentType === 'Fixed Salary' && (isPrimaryFocus || isSecondaryFocus)) {
    if (dsr <= 40) {
      return 'lowDSR';
    } else if (dsr <= 60) {
      return 'moderateDSR';
    } else {
      return 'highDSR';
    }
  }

  if (netIncome < bank.min_income) {
    return 'belowMinIncome';
  }

  if (dsr > 60) {
    return 'flexibleDSR';
  }

  return 'general';
}

export function getRecommendedBanks(
  banks: SupabaseBankProfile[],
  employmentType: string,
  dsr: number,
  netIncome: number,
  useLPPSA: boolean = false
): BankRecommendation[] {
  if (!banks || banks.length === 0) {
    return [];
  }

  if (useLPPSA && employmentType === 'Government Employee') {
    const lppsaBank = banks.find(bank => bank.bank_name === 'LPPSA');
    if (lppsaBank) {
      return [{
        name: lppsaBank.bank_name,
        score: 100,
        interestRateRange: `${lppsaBank.interest_rate_min}% - ${lppsaBank.interest_rate_max}%`,
        reason: 'governmentEmployee',
        minIncome: lppsaBank.min_income,
        maxDSR: lppsaBank.max_dsr,
        specialFeatures: lppsaBank.special_features || [],
      }];
    }
    return [];
  }

  const scoredBanks = banks.map(bank => {
    const score = calculateBankScore(bank, employmentType, dsr, netIncome);
    const reasonKey = getBankReasonKey(bank, employmentType, dsr, netIncome);

    return {
      name: bank.bank_name,
      score,
      interestRateRange: `${bank.interest_rate_min}% - ${bank.interest_rate_max}%`,
      reason: reasonKey,
      minIncome: bank.min_income,
      maxDSR: bank.max_dsr,
      specialFeatures: bank.special_features || [],
    };
  });

  scoredBanks.sort((a, b) => b.score - a.score);

  const highScoreBanks = scoredBanks.filter(b => b.score >= 60);
  const goodScoreBanks = scoredBanks.filter(b => b.score >= 50 && b.score < 60);

  if (highScoreBanks.length >= 3) {
    return highScoreBanks.slice(0, 4);
  } else if (highScoreBanks.length > 0) {
    const remaining = 4 - highScoreBanks.length;
    return [...highScoreBanks, ...goodScoreBanks.slice(0, remaining)];
  } else {
    return scoredBanks.filter(b => b.score >= 40).slice(0, 3);
  }
}

// Calculate EPF (KWSP) deduction - 11% of gross income
export function calculateEPFDeduction(grossIncome: number, hasKWSP: boolean): number {
  if (!hasKWSP || grossIncome <= 0) return 0;
  return grossIncome * (EPF_DEDUCTION_RATE / 100);
}

// Calculate annual tax based on Malaysian tax brackets (2024)
export function calculateAnnualTax(annualIncome: number): number {
  if (annualIncome <= 5000) return 0;

  let tax = 0;

  // Tax brackets for Malaysian residents
  if (annualIncome > 5000) {
    const taxable1 = Math.min(annualIncome - 5000, 15000); // RM5,001 - RM20,000
    tax += taxable1 * 0.01;
  }

  if (annualIncome > 20000) {
    const taxable2 = Math.min(annualIncome - 20000, 15000); // RM20,001 - RM35,000
    tax += taxable2 * 0.03;
  }

  if (annualIncome > 35000) {
    const taxable3 = Math.min(annualIncome - 35000, 15000); // RM35,001 - RM50,000
    tax += taxable3 * 0.08;
  }

  if (annualIncome > 50000) {
    const taxable4 = Math.min(annualIncome - 50000, 20000); // RM50,001 - RM70,000
    tax += taxable4 * 0.13;
  }

  if (annualIncome > 70000) {
    const taxable5 = Math.min(annualIncome - 70000, 30000); // RM70,001 - RM100,000
    tax += taxable5 * 0.21;
  }

  if (annualIncome > 100000) {
    const taxable6 = Math.min(annualIncome - 100000, 150000); // RM100,001 - RM250,000
    tax += taxable6 * 0.24;
  }

  if (annualIncome > 250000) {
    const taxable7 = Math.min(annualIncome - 250000, 150000); // RM250,001 - RM400,000
    tax += taxable7 * 0.245;
  }

  if (annualIncome > 400000) {
    const taxable8 = Math.min(annualIncome - 400000, 200000); // RM400,001 - RM600,000
    tax += taxable8 * 0.25;
  }

  if (annualIncome > 600000) {
    const taxable9 = Math.min(annualIncome - 600000, 400000); // RM600,001 - RM1,000,000
    tax += taxable9 * 0.26;
  }

  if (annualIncome > 1000000) {
    const taxable10 = Math.min(annualIncome - 1000000, 1000000); // RM1,000,001 - RM2,000,000
    tax += taxable10 * 0.28;
  }

  if (annualIncome > 2000000) {
    tax += (annualIncome - 2000000) * 0.30; // Above RM2,000,000
  }

  return tax;
}

// Calculate monthly tax deduction (simplified estimate)
export function calculateMonthlyTaxDeduction(monthlyGrossIncome: number, hasTax: boolean): number {
  if (!hasTax || monthlyGrossIncome <= 0) return 0;

  const annualIncome = monthlyGrossIncome * 12;
  const annualTax = calculateAnnualTax(annualIncome);

  return annualTax / 12;
}

// Check if hustle income is valid for bank calculation
export function isHustleIncomeValid(hustleHasKWSP: boolean, hustleHasTax: boolean): boolean {
  return hustleHasKWSP || hustleHasTax;
}

// Calculate total GROSS income (before deductions)
export function calculateGrossIncome(income: IncomeBreakdown): number {
  const monthlyBonus = (income.annualBonus / 12) * (BANK_BONUS_PERCENTAGE / 100);
  const monthlyPassiveIncome = income.passiveIncome * (BANK_PASSIVE_INCOME_PERCENTAGE / 100);
  const monthlyDividend = (income.dividendPassiveIncome / 6) * (BANK_DIVIDEND_PERCENTAGE / 100);
  const monthlyCommission = (income.commissionIncome / 6) * (BANK_COMMISSION_PERCENTAGE / 100);

  const monthlyHustleIncome = isHustleIncomeValid(income.hustleHasKWSP, income.hustleHasTax)
    ? income.hustleIncome / 6
    : 0;

  return (
    income.monthlyGrossSalary +
    income.fixedAllowance +
    monthlyBonus +
    monthlyPassiveIncome +
    monthlyDividend +
    monthlyHustleIncome +
    monthlyCommission
  );
}

// Calculate total NET income after EPF and tax deductions
export function calculateTotalIncome(income: IncomeBreakdown): number {
  // Main salary - calculate gross first
  let grossMainSalary = income.monthlyGrossSalary + income.fixedAllowance;
  const monthlyBonus = (income.annualBonus / 12) * (BANK_BONUS_PERCENTAGE / 100);
  grossMainSalary += monthlyBonus;

  // Apply EPF deduction to main salary if applicable
  const mainSalaryEPFDeduction = calculateEPFDeduction(grossMainSalary, income.hasKWSP);

  // Apply tax deduction to main salary if applicable
  const mainSalaryTaxDeduction = calculateMonthlyTaxDeduction(grossMainSalary, income.hasTax);

  // Calculate net main salary
  const netMainSalary = grossMainSalary - mainSalaryEPFDeduction - mainSalaryTaxDeduction;

  // Hustle income (6 months average) - only if valid (has KWSP or tax)
  let netHustleIncome = 0;
  if (isHustleIncomeValid(income.hustleHasKWSP, income.hustleHasTax)) {
    const monthlyHustleIncome = income.hustleIncome / 6;
    const hustleEPFDeduction = calculateEPFDeduction(monthlyHustleIncome, income.hustleHasKWSP);
    const hustleTaxDeduction = calculateMonthlyTaxDeduction(monthlyHustleIncome, income.hustleHasTax);
    netHustleIncome = monthlyHustleIncome - hustleEPFDeduction - hustleTaxDeduction;
  }

  // Commission income (6 months average) - bank calculates 75%
  const monthlyCommission = (income.commissionIncome / 6) * (BANK_COMMISSION_PERCENTAGE / 100);

  // Passive income (rental, etc) - bank calculates 70%
  const monthlyPassiveIncome = income.passiveIncome * (BANK_PASSIVE_INCOME_PERCENTAGE / 100);

  // Dividend income (6 months average) - bank calculates 100%
  const monthlyDividend = (income.dividendPassiveIncome / 6) * (BANK_DIVIDEND_PERCENTAGE / 100);

  // Total net income
  return (
    netMainSalary +
    netHustleIncome +
    monthlyCommission +
    monthlyPassiveIncome +
    monthlyDividend
  );
}

function calculateIndividualMetrics(
  income: IncomeBreakdown,
  carLoan: number,
  creditCard: number,
  personalLoan: number,
  additionalCommitments: { id: string; type: string; amount: number }[]
) {
  const additionalCommitmentsSum = additionalCommitments.reduce(
    (sum, commitment) => sum + commitment.amount,
    0
  );

  const totalCommitments = carLoan + creditCard + personalLoan + additionalCommitmentsSum;
  const grossIncome = calculateGrossIncome(income);
  const netIncome = calculateTotalIncome(income);

  const dsr = netIncome > 0 ? (totalCommitments / netIncome) * 100 : 0;
  const remainingIncome = netIncome - totalCommitments;

  return {
    grossIncome,
    netIncome,
    totalCommitments,
    dsr,
    remainingIncome,
  };
}

export function calculateResults(inputs: CalculatorInputs, banks: SupabaseBankProfile[] = []): CalculationResults {
  const isJointApplication = inputs.isJointLoan && inputs.coApplicant;

  const applicant1Metrics = calculateIndividualMetrics(
    inputs.income,
    inputs.carLoan,
    inputs.creditCard,
    inputs.personalLoan,
    inputs.additionalCommitments
  );

  let applicant2Metrics;
  if (isJointApplication && inputs.coApplicant) {
    applicant2Metrics = calculateIndividualMetrics(
      inputs.coApplicant.income,
      inputs.coApplicant.carLoan,
      inputs.coApplicant.creditCard,
      inputs.coApplicant.personalLoan,
      inputs.coApplicant.additionalCommitments
    );
  }

  const additionalCommitmentsSum = inputs.additionalCommitments.reduce(
    (sum, commitment) => sum + commitment.amount,
    0
  );

  let coApplicantCommitmentsSum = 0;
  if (isJointApplication && inputs.coApplicant) {
    coApplicantCommitmentsSum = inputs.coApplicant.additionalCommitments.reduce(
      (sum, commitment) => sum + commitment.amount,
      0
    );
  }

  const mainApplicantCommitments =
    inputs.carLoan +
    inputs.creditCard +
    inputs.personalLoan +
    additionalCommitmentsSum;

  const coApplicantCommitments = isJointApplication && inputs.coApplicant
    ? inputs.coApplicant.carLoan +
      inputs.coApplicant.creditCard +
      inputs.coApplicant.personalLoan +
      coApplicantCommitmentsSum
    : 0;

  const totalBankCommitments = mainApplicantCommitments + coApplicantCommitments;
  const totalExpenses = totalBankCommitments;

  const grossIncome = isJointApplication && applicant2Metrics
    ? applicant1Metrics.grossIncome + applicant2Metrics.grossIncome
    : applicant1Metrics.grossIncome;

  const netIncome = isJointApplication && applicant2Metrics
    ? applicant1Metrics.netIncome + applicant2Metrics.netIncome
    : applicant1Metrics.netIncome;

  const income = inputs.income;
  let totalEPFDeduction = 0;
  let totalTaxDeduction = 0;

  const grossMainSalary = income.monthlyGrossSalary + income.fixedAllowance + ((income.annualBonus / 12) * (BANK_BONUS_PERCENTAGE / 100));
  totalEPFDeduction += calculateEPFDeduction(grossMainSalary, income.hasKWSP);
  totalTaxDeduction += calculateMonthlyTaxDeduction(grossMainSalary, income.hasTax);

  if (isHustleIncomeValid(income.hustleHasKWSP, income.hustleHasTax)) {
    const monthlyHustleIncome = income.hustleIncome / 6;
    totalEPFDeduction += calculateEPFDeduction(monthlyHustleIncome, income.hustleHasKWSP);
    totalTaxDeduction += calculateMonthlyTaxDeduction(monthlyHustleIncome, income.hustleHasTax);
  }

  if (isJointApplication && inputs.coApplicant) {
    const coIncome = inputs.coApplicant.income;
    const coGrossMainSalary = coIncome.monthlyGrossSalary + coIncome.fixedAllowance + ((coIncome.annualBonus / 12) * (BANK_BONUS_PERCENTAGE / 100));
    totalEPFDeduction += calculateEPFDeduction(coGrossMainSalary, coIncome.hasKWSP);
    totalTaxDeduction += calculateMonthlyTaxDeduction(coGrossMainSalary, coIncome.hasTax);

    if (isHustleIncomeValid(coIncome.hustleHasKWSP, coIncome.hustleHasTax)) {
      const coMonthlyHustleIncome = coIncome.hustleIncome / 6;
      totalEPFDeduction += calculateEPFDeduction(coMonthlyHustleIncome, coIncome.hustleHasKWSP);
      totalTaxDeduction += calculateMonthlyTaxDeduction(coMonthlyHustleIncome, coIncome.hustleHasTax);
    }
  }

  const monthlySalary = netIncome;
  const remainingIncome = monthlySalary - totalBankCommitments;

  const maxDSRAllowed = getMaxDSRPercentage(netIncome, inputs.income.useLPPSA);

  const maxMonthlyPayment = (inputs.income.employmentType === 'Government Employee' && inputs.income.useLPPSA)
    ? monthlySalary * (maxDSRAllowed / 100)
    : monthlySalary * (maxDSRAllowed / 100) - totalBankCommitments;

  const loanTermYears = inputs.loanTerm;

  const multiplier = (inputs.income.employmentType === 'Government Employee' && inputs.income.useLPPSA)
    ? LPPSA_MULTIPLIER
    : BANK_MULTIPLIER;

  const affordablePropertyPrice = Math.max(0, maxMonthlyPayment) * multiplier;

  const downPaymentPercentage = inputs.requiresDownPayment ? DOWN_PAYMENT_PERCENTAGE : 0;
  const maxLoanAmount = affordablePropertyPrice * (1 - downPaymentPercentage / 100);

  const combinedSavings = isJointApplication && inputs.coApplicant
    ? inputs.monthlySavings + inputs.coApplicant.monthlySavings
    : inputs.monthlySavings;

  const autoCalculatedRate = calculateInterestRate(combinedSavings, affordablePropertyPrice, inputs.income.employmentType, banks, inputs.income.useLPPSA);
  const interestRate = inputs.manualInterestRate !== undefined ? inputs.manualInterestRate : autoCalculatedRate;
  const baseRate = calculateAverageInterestRate(banks, inputs.income.employmentType);
  const hasBetterRate = interestRate < baseRate;

  const savingsPercentage = affordablePropertyPrice > 0
    ? (combinedSavings / affordablePropertyPrice) * 100
    : 0;

  const downPayment = affordablePropertyPrice * (downPaymentPercentage / 100);

  const recommendedMonthlyPayment = calculateMonthlyPayment(
    maxLoanAmount,
    interestRate,
    loanTermYears
  );

  const dsr =
    monthlySalary > 0
      ? (totalBankCommitments / monthlySalary) * 100
      : 0;

  const dsrAfterLoan =
    monthlySalary > 0
      ? ((totalBankCommitments + recommendedMonthlyPayment) / monthlySalary) * 100
      : 0;

  let dsrStatus: 'suitable' | 'moderate' | 'not-suitable';
  if (dsr < 50) {
    dsrStatus = 'suitable';
  } else if (dsr <= maxDSRAllowed) {
    dsrStatus = 'moderate';
  } else {
    dsrStatus = 'not-suitable';
  }

  const recommendedBanks = getRecommendedBanks(
    banks,
    inputs.income.employmentType,
    dsr,
    netIncome,
    inputs.income.useLPPSA
  );

  const remainingAfterLoanPayment = netIncome - recommendedMonthlyPayment - totalBankCommitments;

  return {
    totalBankCommitments,
    totalExpenses,
    remainingIncome,
    maxMonthlyPayment,
    maxLoanAmount,
    affordablePropertyPrice,
    downPayment,
    recommendedMonthlyPayment,
    dsr,
    dsrAfterLoan,
    dsrStatus,
    recommendedBanks,
    grossIncome,
    netIncome,
    totalEPFDeduction,
    totalTaxDeduction,
    interestRate,
    hasBetterRate,
    savingsPercentage,
    loanTerm: loanTermYears,
    maxDSRAllowed,
    remainingAfterLoanPayment,
    isJointApplication,
    applicant1: isJointApplication ? applicant1Metrics : undefined,
    applicant2: isJointApplication ? applicant2Metrics : undefined,
  };
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('en-MY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
