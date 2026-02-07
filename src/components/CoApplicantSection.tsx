import { CoApplicantData, IncomeBreakdown, AdditionalCommitment } from '../types';
import { formatCurrency, calculateGrossIncome, calculateTotalIncome, calculateEPFDeduction, calculateMonthlyTaxDeduction } from '../utils/calculations';
import { Language, translations } from '../translations';
import IncomeSection from './IncomeSection';
import AdditionalIncomeSection from './AdditionalIncomeSection';
import CommitmentsSection from './CommitmentsSection';

interface CoApplicantSectionProps {
  coApplicant: CoApplicantData;
  onCoApplicantChange: (field: keyof CoApplicantData, value: any) => void;
  onCoApplicantIncomeChange: (field: keyof IncomeBreakdown, value: number | string | boolean) => void;
  onAddCoApplicantCommitment: () => void;
  onRemoveCoApplicantCommitment: (id: string) => void;
  onUpdateCoApplicantCommitment: (id: string, field: 'type' | 'amount', value: any) => void;
  totalBankCommitments: number;
  language: Language;
  selectedYear: number;
}

export default function CoApplicantSection({
  coApplicant,
  onCoApplicantChange,
  onCoApplicantIncomeChange,
  onAddCoApplicantCommitment,
  onRemoveCoApplicantCommitment,
  onUpdateCoApplicantCommitment,
  totalBankCommitments,
  language,
  selectedYear,
}: CoApplicantSectionProps) {
  const t = translations[language];

  const handleCommitmentInput = (field: 'carLoan' | 'creditCard' | 'personalLoan', value: number) => {
    onCoApplicantChange(field, value);
  };

  const handleNumberInput = (field: 'monthlySavings', value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value.replace(/,/g, ''));
    if (!isNaN(numValue) && numValue >= 0) {
      onCoApplicantChange(field, numValue);
    }
  };

  const formatInputValue = (value: number): string => {
    return value === 0 ? '' : formatCurrency(value);
  };

  const grossIncome = calculateGrossIncome(coApplicant.income);
  const netIncome = calculateTotalIncome(coApplicant.income);

  const grossMainSalary = coApplicant.income.monthlyGrossSalary + (coApplicant.income.annualBonus / 12);
  const mainSalaryEPF = calculateEPFDeduction(grossMainSalary, coApplicant.income.hasKWSP);
  const mainSalaryTax = calculateMonthlyTaxDeduction(grossMainSalary, coApplicant.income.hasTax);

  const monthlyHustleIncome = coApplicant.income.hustleIncome / 6;
  const hustleEPF = calculateEPFDeduction(monthlyHustleIncome, coApplicant.income.hustleHasKWSP);
  const hustleTax = calculateMonthlyTaxDeduction(monthlyHustleIncome, coApplicant.income.hustleHasTax);

  const totalEPFDeduction = mainSalaryEPF + hustleEPF;
  const totalTaxDeduction = mainSalaryTax + hustleTax;

  return (
    <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border-l-4 border-emerald-500 border border-gray-200 shadow-sm space-y-6 animate-slideDown">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
          2
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">
          {t.jointLoan.coApplicantInfo}
        </h3>
      </div>

      <IncomeSection
        income={coApplicant.income}
        onIncomeChange={onCoApplicantIncomeChange}
        showAdditionalIncome={coApplicant.showAdditionalIncome}
        onToggleAdditionalIncome={() => onCoApplicantChange('showAdditionalIncome', !coApplicant.showAdditionalIncome)}
        language={language}
      />

      {coApplicant.showAdditionalIncome && (
        <>
          <AdditionalIncomeSection
            income={coApplicant.income}
            onIncomeChange={onCoApplicantIncomeChange}
            language={language}
          />

          {coApplicant.income.employmentType === 'Government Employee' && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <label className="flex items-start cursor-pointer hover:bg-green-100 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={coApplicant.income.useLPPSA}
                  onChange={(e) => onCoApplicantIncomeChange('useLPPSA', e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded mt-0.5"
                />
                <div className="ml-3 flex-1">
                  <span className="text-sm font-semibold text-gray-800">{t.income.useLPPSA}</span>
                  <p className="text-xs text-gray-600 mt-1">{t.income.lppsaNote}</p>
                </div>
              </label>
            </div>
          )}

          <div className="bg-white rounded-lg p-4 border-l-4 border-emerald-400 border border-gray-200 shadow-sm">
            <div className="space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">{t.income.grossIncome}:</span>
                <span className="text-emerald-700 font-semibold">RM {formatCurrency(grossIncome)}</span>
              </div>

              {(totalEPFDeduction > 0 || totalTaxDeduction > 0) && (
                <div className="space-y-1 py-2">
                  {totalEPFDeduction > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{t.income.epfDeduction}:</span>
                      <span className="text-red-600">- RM {formatCurrency(totalEPFDeduction)}</span>
                    </div>
                  )}
                  {totalTaxDeduction > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{t.income.taxDeduction}:</span>
                      <span className="text-red-600">- RM {formatCurrency(totalTaxDeduction)}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-sm font-bold text-gray-800">{t.income.netIncome}:</span>
                <span className="text-emerald-700 text-lg font-bold">RM {formatCurrency(netIncome)}</span>
              </div>
            </div>
          </div>
        </>
      )}

      <CommitmentsSection
        carLoan={coApplicant.carLoan}
        creditCard={coApplicant.creditCard}
        personalLoan={coApplicant.personalLoan}
        additionalCommitments={coApplicant.additionalCommitments}
        onInputChange={handleCommitmentInput}
        onAddCommitment={onAddCoApplicantCommitment}
        onRemoveCommitment={onRemoveCoApplicantCommitment}
        onUpdateCommitment={onUpdateCoApplicantCommitment}
        totalBankCommitments={totalBankCommitments}
        language={language}
      />

      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-emerald-500">{t.savings.title}</h2>
        <input
          type="text"
          placeholder="0"
          value={formatInputValue(coApplicant.monthlySavings)}
          onChange={(e) => handleNumberInput('monthlySavings', e.target.value)}
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
    </div>
  );
}
