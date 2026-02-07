import { CalculationResults } from '../types';
import { formatCurrency } from '../utils/calculations';
import { Language, translations } from '../translations';
import { AlertTriangle, Loader2, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import IncomeBreakdownBar from './IncomeBreakdownBar';

interface ResultsPanelProps {
  results: CalculationResults;
  language: Language;
  onLoanTermChange: (value: number) => void;
  onInterestRateChange: (value: number | undefined) => void;
  useLPPSA?: boolean;
  isLoadingBanks?: boolean;
  manualInterestRate?: number;
  shouldHighlight?: boolean;
  requiresDownPayment?: boolean;
}

export default function ResultsPanel({
  results,
  language,
  onLoanTermChange,
  onInterestRateChange,
  useLPPSA = false,
  isLoadingBanks = false,
  manualInterestRate,
  shouldHighlight = false,
  requiresDownPayment = false,
}: ResultsPanelProps) {
  const t = translations[language];
  const [editingRate, setEditingRate] = useState(false);
  const [tempRate, setTempRate] = useState(results.interestRate.toFixed(2));

  const handleRateClick = () => {
    setEditingRate(true);
    setTempRate(results.interestRate.toFixed(2));
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempRate(e.target.value);
  };

  const handleRateBlur = () => {
    const numericRate = parseFloat(tempRate);
    if (!isNaN(numericRate) && numericRate > 0) {
      onInterestRateChange(numericRate);
    }
    setEditingRate(false);
  };

  const handleRateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRateBlur();
    } else if (e.key === 'Escape') {
      setEditingRate(false);
      setTempRate(results.interestRate.toFixed(2));
    }
  };

  const handleResetRate = () => {
    onInterestRateChange(undefined);
    setEditingRate(false);
  };

  const isManualRate = manualInterestRate !== undefined;
  const getDSRColor = () => {
    if (results.dsrStatus === 'suitable') return 'bg-green-500';
    if (results.dsrStatus === 'moderate') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getDSRText = () => {
    if (results.dsrStatus === 'suitable') return t.results.suitable;
    if (results.dsrStatus === 'moderate') return t.results.moderate;
    return t.results.notSuitable;
  };

  const shouldShowDSRWarning = results.dsr > results.maxDSRAllowed;

  return (
    <div className="bg-[#F5F7FA] rounded-lg shadow-lg p-6 md:p-8">
      <div className="space-y-6">
        <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${shouldHighlight ? 'animate-blueGlow' : ''}`}>
          <h3 className="text-sm text-gray-600 mb-2 font-medium">
            {t.results.maxPropertyPrice}
          </h3>
          <p className="text-4xl font-bold text-gray-800 mb-4">
            RM {formatCurrency(results.affordablePropertyPrice)}
          </p>

          {results.savingsPercentage > 0 && (
            <div className="mb-4 text-sm">
              <p className="text-gray-600">
                {t.results.savingsVsPrice}: <span className="font-semibold text-gray-800">{results.savingsPercentage.toFixed(1)}%</span>
              </p>
            </div>
          )}

          <div className="space-y-3 mt-4">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                {t.results.recommendedMonthlyPayment}
              </p>
              <p className="text-xl font-bold text-gray-800">
                RM {formatCurrency(results.recommendedMonthlyPayment)}
              </p>
            </div>
            {requiresDownPayment && (
              <div>
                <p className="text-sm text-gray-600 font-medium">{t.results.downPayment}</p>
                <p className="text-xl font-bold text-gray-800">
                  RM {formatCurrency(results.downPayment)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500 mb-1 font-medium">{t.results.remainingAfterLoan}</p>
            <p className="text-lg font-bold text-gray-800">
              RM {formatCurrency(results.remainingAfterLoanPayment)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500 mb-1 font-medium">{t.results.interestRate}</p>
            <div className="flex items-center gap-2">
              {editingRate ? (
                <input
                  type="number"
                  step="0.01"
                  value={tempRate}
                  onChange={handleRateChange}
                  onBlur={handleRateBlur}
                  onKeyDown={handleRateKeyDown}
                  className="text-lg font-bold text-gray-800 border border-blue-500 rounded px-2 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <button
                  onClick={handleRateClick}
                  className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-3 py-1.5 bg-gray-100 hover:bg-gray-200"
                >
                  {results.interestRate.toFixed(2)}%
                </button>
              )}
              {isManualRate && (
                <button
                  onClick={handleResetRate}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  title={language === 'ms' ? 'Kembali ke nilai auto' : 'Reset to auto'}
                >
                  <RotateCcw size={16} className="text-gray-600" />
                </button>
              )}
              {results.hasBetterRate && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                  {t.results.betterRateBadge}
                </span>
              )}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500 mb-1 font-medium">{t.results.loanPeriod}</p>
            <select
              value={results.loanTerm}
              onChange={(e) => onLoanTermChange(parseInt(e.target.value))}
              className="text-lg font-bold text-gray-800 bg-transparent border-none focus:outline-none cursor-pointer w-full"
            >
              {Array.from({ length: 16 }, (_, i) => 20 + i).map((year) => (
                <option key={year} value={year}>
                  {year} {t.results.years}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {t.results.dsrStatus}
          </h3>
          <div className="flex items-center gap-3 mb-6">
            <div
              className={`${getDSRColor()} text-white px-6 py-2 rounded-full font-semibold text-lg`}
            >
              {getDSRText()}
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {results.dsr.toFixed(0)}%
            </div>
          </div>

          {shouldShowDSRWarning && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-yellow-800 font-medium leading-snug">
                  {t.results.dsrWarning.replace('{{dsr}}', results.dsr.toFixed(0))}
                </p>
              </div>
            </div>
          )}

          <IncomeBreakdownBar
            netIncome={results.netIncome}
            currentCommitments={results.totalBankCommitments}
            loanPayment={results.recommendedMonthlyPayment}
            language={language}
          />

          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {useLPPSA ? (
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-semibold">
                  {t.results.lppsaCalculation}
                </span>
              ) : (
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-semibold">
                  {t.results.commercialBankCalculation}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">
                {t.results.dsrLimit}: {results.maxDSRAllowed}%
              </span>
              {!useLPPSA && results.netIncome < 3000 && results.maxDSRAllowed === 60 && (
                <span className="text-xs text-amber-600 font-medium">
                  ({language === 'ms' ? 'Gaji < RM3,000' : 'Salary < RM3,000'})
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {t.results.recommendedBanks}
          </h3>
          {isLoadingBanks ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
          ) : results.recommendedBanks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>{language === 'ms' ? 'Tiada bank ditemui' : 'No banks found'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.recommendedBanks.map((bank, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 transition-all hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex flex-col gap-2">
                    <h4 className="text-lg font-bold text-gray-800">{bank.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600">
                        {t.results.interestRateLabel}:
                      </span>
                      <span className="text-sm font-bold text-blue-700">
                        {bank.interestRateRange}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
