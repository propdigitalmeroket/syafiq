import { Language, translations } from '../translations';
import { formatCurrency } from '../utils/calculations';

interface IncomeBreakdownBarProps {
  netIncome: number;
  currentCommitments: number;
  loanPayment: number;
  language: Language;
}

export default function IncomeBreakdownBar({
  netIncome,
  currentCommitments,
  loanPayment,
  language,
}: IncomeBreakdownBarProps) {
  const t = translations[language];

  const remainingBeforeLoan = netIncome - currentCommitments;
  const remainingAfterLoan = netIncome - currentCommitments - loanPayment;

  const currentCommitmentsPercentage = (currentCommitments / netIncome) * 100;
  const loanPaymentPercentage = (loanPayment / netIncome) * 100;
  const remainingBeforePercentage = (remainingBeforeLoan / netIncome) * 100;
  const remainingAfterPercentage = (remainingAfterLoan / netIncome) * 100;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-700">{t.results.beforeLoan}</h4>
          <span className="text-sm text-gray-600">
            {t.results.dsr}: {currentCommitmentsPercentage.toFixed(0)}%
          </span>
        </div>
        <div className="w-full h-12 bg-gray-200 rounded-lg overflow-hidden flex">
          {currentCommitmentsPercentage > 0 && (
            <div
              className="bg-red-500 flex items-center justify-center text-white text-xs font-semibold transition-all duration-500"
              style={{ width: `${currentCommitmentsPercentage}%` }}
            >
              {currentCommitmentsPercentage > 15 && (
                <span className="px-2">{t.results.commitments}</span>
              )}
            </div>
          )}
          {remainingBeforePercentage > 0 && (
            <div
              className="bg-green-500 flex items-center justify-center text-white text-xs font-semibold transition-all duration-500"
              style={{ width: `${remainingBeforePercentage}%` }}
            >
              {remainingBeforePercentage > 15 && (
                <span className="px-2">{t.results.remaining}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0 mt-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-red-500 flex-shrink-0"></div>
            <span className="text-gray-700">
              <span className="font-medium">{t.results.commitments}:</span>{' '}
              <span className="font-semibold text-gray-900">RM {formatCurrency(currentCommitments)}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-green-500 flex-shrink-0"></div>
            <span className="text-gray-700">
              <span className="font-medium">{t.results.remaining}:</span>{' '}
              <span className="font-semibold text-gray-900">RM {formatCurrency(remainingBeforeLoan)}</span>
            </span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-700">{t.results.afterLoan}</h4>
          <span className="text-sm text-gray-600">
            {t.results.dsr}: {(currentCommitmentsPercentage + loanPaymentPercentage).toFixed(0)}%
          </span>
        </div>
        <div className="w-full h-12 bg-gray-200 rounded-lg overflow-hidden flex">
          {currentCommitmentsPercentage > 0 && (
            <div
              className="bg-red-500 flex items-center justify-center text-white text-xs font-semibold transition-all duration-500"
              style={{ width: `${currentCommitmentsPercentage}%` }}
            >
              {currentCommitmentsPercentage > 15 && (
                <span className="px-2">{t.results.commitments}</span>
              )}
            </div>
          )}
          {loanPaymentPercentage > 0 && (
            <div
              className="bg-orange-500 flex items-center justify-center text-white text-xs font-semibold transition-all duration-500"
              style={{ width: `${loanPaymentPercentage}%` }}
            >
              {loanPaymentPercentage > 15 && (
                <span className="px-2">{t.results.loanPayment}</span>
              )}
            </div>
          )}
          {remainingAfterPercentage > 0 && (
            <div
              className="bg-green-500 flex items-center justify-center text-white text-xs font-semibold transition-all duration-500"
              style={{ width: `${remainingAfterPercentage}%` }}
            >
              {remainingAfterPercentage > 15 && (
                <span className="px-2">{t.results.remaining}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-red-500 flex-shrink-0"></div>
            <span className="text-gray-700">
              <span className="font-medium">{t.results.commitments}:</span>{' '}
              <span className="font-semibold text-gray-900">RM {formatCurrency(currentCommitments)}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-orange-500 flex-shrink-0"></div>
            <span className="text-gray-700">
              <span className="font-medium">{t.results.loanPayment}:</span>{' '}
              <span className="font-semibold text-gray-900">RM {formatCurrency(loanPayment)}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-green-500 flex-shrink-0"></div>
            <span className="text-gray-700">
              <span className="font-medium">{t.results.remaining}:</span>{' '}
              <span className="font-semibold text-gray-900">RM {formatCurrency(remainingAfterLoan)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
