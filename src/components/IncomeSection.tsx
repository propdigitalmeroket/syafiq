import { EmploymentType, IncomeBreakdown } from '../types';
import { formatCurrency, calculateGrossIncome, calculateTotalIncome, calculateEPFDeduction, calculateMonthlyTaxDeduction } from '../utils/calculations';
import { Plus } from 'lucide-react';
import { Language, translations } from '../translations';
import CustomSelect from './CustomSelect';

interface IncomeSectionProps {
  income: IncomeBreakdown;
  onIncomeChange: (field: keyof IncomeBreakdown, value: number | string | boolean) => void;
  showAdditionalIncome: boolean;
  onToggleAdditionalIncome: () => void;
  language: Language;
}

export default function IncomeSection({
  income,
  onIncomeChange,
  showAdditionalIncome,
  onToggleAdditionalIncome,
  language,
}: IncomeSectionProps) {
  const t = translations[language];

  const handleIncomeInput = (field: keyof IncomeBreakdown, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value.replace(/,/g, ''));
    if (!isNaN(numValue) && numValue >= 0) {
      onIncomeChange(field, numValue);
    }
  };

  const formatInputValue = (value: number): string => {
    return value === 0 ? '' : formatCurrency(value);
  };

  const grossIncome = calculateGrossIncome(income);
  const netIncome = calculateTotalIncome(income);

  const grossMainSalary = income.monthlyGrossSalary + (income.annualBonus / 12);
  const mainSalaryEPF = calculateEPFDeduction(grossMainSalary, income.hasKWSP);
  const mainSalaryTax = calculateMonthlyTaxDeduction(grossMainSalary, income.hasTax);

  const monthlyHustleIncome = income.hustleIncome / 6;
  const hustleEPF = calculateEPFDeduction(monthlyHustleIncome, income.hustleHasKWSP);
  const hustleTax = calculateMonthlyTaxDeduction(monthlyHustleIncome, income.hustleHasTax);

  const totalEPFDeduction = mainSalaryEPF + hustleEPF;
  const totalTaxDeduction = mainSalaryTax + hustleTax;

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">
        {t.income.title}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.income.monthlyGrossSalary}
          </label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              type="text"
              placeholder="5,000"
              value={formatInputValue(income.monthlyGrossSalary)}
              onChange={(e) => handleIncomeInput('monthlyGrossSalary', e.target.value)}
              className="flex-1 px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <CustomSelect
              value={income.employmentType}
              onValueChange={(value) => onIncomeChange('employmentType', value as EmploymentType)}
              options={[
                { value: 'Fixed Salary', label: t.income.fixedSalary },
                { value: 'Commission Based', label: t.income.commissionBased },
                { value: 'Government Employee', label: t.income.governmentEmployee },
                { value: 'Self Employed', label: t.income.selfEmployed },
              ]}
              className="w-full sm:w-auto sm:min-w-[180px]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <input
              type="checkbox"
              checked={income.hasKWSP}
              onChange={(e) => onIncomeChange('hasKWSP', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">{t.income.epfContribution}</span>
          </label>
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <input
              type="checkbox"
              checked={income.hasTax}
              onChange={(e) => onIncomeChange('hasTax', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">{t.income.incomeTaxPayment}</span>
          </label>
        </div>

        <button
          onClick={onToggleAdditionalIncome}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-all hover:gap-3 min-h-[44px]"
        >
          <Plus size={18} />
          {t.income.addOtherIncome}
        </button>
      </div>
    </div>
  );
}
