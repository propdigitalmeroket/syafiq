import { IncomeBreakdown, PassiveIncomeType, DividendType } from '../types';
import { formatCurrency, isHustleIncomeValid } from '../utils/calculations';
import { AlertTriangle } from 'lucide-react';
import { Language, translations } from '../translations';

interface AdditionalIncomeSectionProps {
  income: IncomeBreakdown;
  onIncomeChange: (field: keyof IncomeBreakdown, value: number | string | boolean) => void;
  language: Language;
}

export default function AdditionalIncomeSection({
  income,
  onIncomeChange,
  language,
}: AdditionalIncomeSectionProps) {
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

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="bg-blue-50 p-3 sm:p-5 rounded-lg space-y-4 border border-blue-100 animate-in slide-in-from-top-2 duration-300">
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          {t.income.annualBonus}
        </label>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input
            type="text"
            placeholder="0"
            value={formatInputValue(income.annualBonus)}
            onChange={(e) => handleIncomeInput('annualBonus', e.target.value)}
            className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={income.bonusYear}
            onChange={(e) => onIncomeChange('bonusYear', parseInt(e.target.value))}
            className="w-full sm:w-auto max-w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white sm:min-w-[120px] text-sm sm:text-base"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-gray-500 mt-1">{t.income.bonusNote}</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          {t.income.passiveIncome}
        </label>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input
            type="text"
            placeholder="0"
            value={formatInputValue(income.passiveIncome)}
            onChange={(e) => handleIncomeInput('passiveIncome', e.target.value)}
            className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={income.passiveIncomeType}
            onChange={(e) => onIncomeChange('passiveIncomeType', e.target.value as PassiveIncomeType)}
            className="w-full sm:w-auto max-w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white sm:min-w-[180px] text-sm sm:text-base truncate"
          >
            <option value="RENTAL">{t.income.rental}</option>
            <option value="Other Passive Income">{t.income.otherPassive}</option>
          </select>
        </div>
        <p className="text-xs text-gray-500 mt-1">{t.income.passiveIncomeNote}</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          {t.income.dividendIncome}
        </label>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input
            type="text"
            placeholder="0"
            value={formatInputValue(income.dividendPassiveIncome)}
            onChange={(e) => handleIncomeInput('dividendPassiveIncome', e.target.value)}
            className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={income.dividendType}
            onChange={(e) => onIncomeChange('dividendType', e.target.value as DividendType)}
            className="w-full sm:w-auto max-w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white sm:min-w-[180px] text-sm sm:text-base truncate"
          >
            <option value="Tabung Haji Dividend">{t.income.tabungHajiDividend}</option>
            <option value="ASB Dividend">{t.income.asbDividend}</option>
          </select>
        </div>
        <p className="text-xs text-gray-500 mt-1">{t.income.dividendNote}</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          {t.income.hustleIncome}
        </label>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input
            type="text"
            placeholder="0"
            value={formatInputValue(income.hustleIncome)}
            onChange={(e) => handleIncomeInput('hustleIncome', e.target.value)}
            className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex flex-col gap-1 sm:min-w-[140px]">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={income.hustleHasKWSP}
                onChange={(e) => onIncomeChange('hustleHasKWSP', e.target.checked)}
                className="w-3.5 h-3.5 text-blue-600 rounded flex-shrink-0"
              />
              <span className="ml-2 text-xs text-gray-700 whitespace-nowrap">{t.income.epfContributionShort}</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={income.hustleHasTax}
                onChange={(e) => onIncomeChange('hustleHasTax', e.target.checked)}
                className="w-3.5 h-3.5 text-blue-600 rounded flex-shrink-0"
              />
              <span className="ml-2 text-xs text-gray-700 break-words">{t.income.incomeTaxPayment}</span>
            </label>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{t.income.hustleNote}</p>
        {income.hustleIncome > 0 && !isHustleIncomeValid(income.hustleHasKWSP, income.hustleHasTax) && (
          <div className="mt-2 flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5 text-yellow-600" />
            <p className="text-xs text-yellow-800 font-medium leading-snug">
              {t.income.hustleIncomeWarning}
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          {t.income.commissionIncome}
        </label>
        <input
          type="text"
          placeholder="0"
          value={formatInputValue(income.commissionIncome)}
          onChange={(e) => handleIncomeInput('commissionIncome', e.target.value)}
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">{t.income.commissionNote}</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          {t.income.fixedAllowance}
        </label>
        <input
          type="text"
          placeholder="0"
          value={formatInputValue(income.fixedAllowance)}
          onChange={(e) => handleIncomeInput('fixedAllowance', e.target.value)}
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">{t.income.fixedAllowanceNote}</p>
      </div>
    </div>
  );
}
