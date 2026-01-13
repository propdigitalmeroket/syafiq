export type EmploymentType = 'Fixed Salary' | 'Self Employed' | 'Commission Based' | 'Government Employee';

export type PassiveIncomeType = 'RENTAL' | 'Other Passive Income';

export type DividendType = 'Tabung Haji Dividend' | 'ASB Dividend';

export type CommitmentType =
  | 'Personal Loan Kedua'
  | 'Pinjaman Kereta Kedua'
  | 'Pinjaman Loan Perumahan'
  | 'ASB Loan'
  | 'Credit Card'
  | 'Credit Card Tambahan'
  | 'Medical Loan'
  | 'Business Loan'
  | 'Lain-lain';

export interface AdditionalCommitment {
  id: string;
  type: CommitmentType;
  amount: number;
}

export interface IncomeBreakdown {
  monthlyGrossSalary: number;
  employmentType: EmploymentType;
  hasKWSP: boolean;
  hasTax: boolean;
  annualBonus: number;
  bonusYear: number;
  passiveIncome: number;
  passiveIncomeType: PassiveIncomeType;
  dividendPassiveIncome: number;
  dividendType: DividendType;
  hustleIncome: number;
  hustleHasKWSP: boolean;
  hustleHasTax: boolean;
  commissionIncome: number;
  fixedAllowance: number;
  useLPPSA: boolean;
}

export interface CalculatorInputs {
  income: IncomeBreakdown;
  selectedYear: number;
  showAdditionalIncome: boolean;
  carLoan: number;
  creditCard: number;
  personalLoan: number;
  additionalCommitments: AdditionalCommitment[];
  monthlySavings: number;
  loanTerm: number;
  manualInterestRate?: number;
  requiresDownPayment: boolean;
}

export interface BankRecommendation {
  name: string;
  score: number;
  interestRateRange: string;
  reason: string;
  minIncome?: number;
  maxDSR?: number;
  specialFeatures?: string[];
}

export interface CalculationResults {
  totalBankCommitments: number;
  totalExpenses: number;
  remainingIncome: number;
  maxMonthlyPayment: number;
  maxLoanAmount: number;
  affordablePropertyPrice: number;
  downPayment: number;
  recommendedMonthlyPayment: number;
  dsr: number;
  dsrAfterLoan: number;
  dsrStatus: 'suitable' | 'moderate' | 'not-suitable';
  recommendedBanks: BankRecommendation[];
  grossIncome: number;
  netIncome: number;
  totalEPFDeduction: number;
  totalTaxDeduction: number;
  interestRate: number;
  hasBetterRate: boolean;
  savingsPercentage: number;
  loanTerm: number;
  maxDSRAllowed: number;
  remainingAfterLoanPayment: number;
}
