import { useState } from 'react';
import { CalculatorInputs, IncomeBreakdown, CoApplicantData } from '../types';
import { formatCurrency, calculateGrossIncome, calculateTotalIncome, calculateEPFDeduction, calculateMonthlyTaxDeduction } from '../utils/calculations';
import { AlertTriangle, Users } from 'lucide-react';
import { Language, translations } from '../translations';
import ConfirmDialog from './ConfirmDialog';
import IncomeSection from './IncomeSection';
import AdditionalIncomeSection from './AdditionalIncomeSection';
import CommitmentsSection from './CommitmentsSection';
import CoApplicantSection from './CoApplicantSection';

interface InputPanelProps {
  inputs: CalculatorInputs;
  onInputChange: (field: keyof CalculatorInputs, value: any) => void;
  onIncomeChange: (field: keyof IncomeBreakdown, value: number | string | boolean) => void;
  onAddCommitment: () => void;
  onRemoveCommitment: (id: string) => void;
  onUpdateCommitment: (id: string, field: 'type' | 'amount', value: any) => void;
  onReset: () => void;
  totalBankCommitments: number;
  totalExpenses: number;
  remainingIncome: number;
  language: Language;
  onCheckEligibility?: () => void;
  onCoApplicantChange?: (field: keyof CoApplicantData, value: any) => void;
  onCoApplicantIncomeChange?: (field: keyof IncomeBreakdown, value: number | string | boolean) => void;
  onAddCoApplicantCommitment?: () => void;
  onRemoveCoApplicantCommitment?: (id: string) => void;
  onUpdateCoApplicantCommitment?: (id: string, field: 'type' | 'amount', value: any) => void;
  coApplicantTotalCommitments?: number;
}

export default function InputPanel({
  inputs,
  onInputChange,
  onIncomeChange,
  onAddCommitment,
  onRemoveCommitment,
  onUpdateCommitment,
  onReset,
  totalBankCommitments,
  totalExpenses,
  remainingIncome,
  language,
  onCheckEligibility,
  onCoApplicantChange,
  onCoApplicantIncomeChange,
  onAddCoApplicantCommitment,
  onRemoveCoApplicantCommitment,
  onUpdateCoApplicantCommitment,
  coApplicantTotalCommitments = 0,
}: InputPanelProps) {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const t = translations[language];

  const handleResetClick = () => {
    setShowResetDialog(true);
  };

  const handleConfirmReset = () => {
    onReset();
    setShowResetDialog(false);
  };

  const handleCancelReset = () => {
    setShowResetDialog(false);
  };

  const handleToggleJointLoan = () => {
    onInputChange('isJointLoan', !inputs.isJointLoan);
  };

  const handleNumberInput = (field: 'monthlySavings', value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value.replace(/,/g, ''));
    if (!isNaN(numValue) && numValue >= 0) {
      onInputChange(field, numValue);
    }
  };

  const formatInputValue = (value: number): string => {
    return value === 0 ? '' : formatCurrency(value);
  };

  const handleCommitmentInput = (field: 'carLoan' | 'creditCard' | 'personalLoan', value: number) => {
    onInputChange(field, value);
  };

  const grossIncome = calculateGrossIncome(inputs.income);
  const netIncome = calculateTotalIncome(inputs.income);

  const grossMainSalary = inputs.income.monthlyGrossSalary + (inputs.income.annualBonus / 12);
  const mainSalaryEPF = calculateEPFDeduction(grossMainSalary, inputs.income.hasKWSP);
  const mainSalaryTax = calculateMonthlyTaxDeduction(grossMainSalary, inputs.income.hasTax);

  const monthlyHustleIncome = inputs.income.hustleIncome / 6;
  const hustleEPF = calculateEPFDeduction(monthlyHustleIncome, inputs.income.hustleHasKWSP);
  const hustleTax = calculateMonthlyTaxDeduction(monthlyHustleIncome, inputs.income.hustleHasTax);

  const totalEPFDeduction = mainSalaryEPF + hustleEPF;
  const totalTaxDeduction = mainSalaryTax + hustleTax;

  return (
    <>
      <ConfirmDialog
        isOpen={showResetDialog}
        title={t.dialogs.resetTitle}
        message={t.dialogs.resetMessage}
        confirmLabel={t.buttons.confirm}
        cancelLabel={t.buttons.cancel}
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
      />
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <div className="space-y-8">
          {inputs.isJointLoan && (
            <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-300">
              <div className="w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                {t.jointLoan.mainApplicant}
              </h3>
            </div>
          )}
          <IncomeSection
            income={inputs.income}
            onIncomeChange={onIncomeChange}
            showAdditionalIncome={inputs.showAdditionalIncome}
            onToggleAdditionalIncome={() => onInputChange('showAdditionalIncome', !inputs.showAdditionalIncome)}
            language={language}
          />

          {inputs.showAdditionalIncome && (
            <>
              <AdditionalIncomeSection
                income={inputs.income}
                onIncomeChange={onIncomeChange}
                language={language}
              />

              {inputs.income.employmentType === 'Government Employee' && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <label className="flex items-start cursor-pointer hover:bg-green-100 p-2 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={inputs.income.useLPPSA}
                      onChange={(e) => onIncomeChange('useLPPSA', e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded mt-0.5"
                    />
                    <div className="ml-3 flex-1">
                      <span className="text-sm font-semibold text-gray-800">{t.income.useLPPSA}</span>
                      <p className="text-xs text-gray-600 mt-1">{t.income.lppsaNote}</p>
                    </div>
                  </label>
                </div>
              )}

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-blue-300">
                    <span className="text-sm font-medium text-gray-700">{t.income.grossIncome}:</span>
                    <span className="text-blue-700 font-semibold">RM {formatCurrency(grossIncome)}</span>
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

                  <div className="flex justify-between items-center pt-2 border-t border-blue-300">
                    <span className="text-sm font-bold text-gray-800">{t.income.netIncome}:</span>
                    <span className="text-blue-700 text-lg font-bold">RM {formatCurrency(netIncome)}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          <CommitmentsSection
            carLoan={inputs.carLoan}
            creditCard={inputs.creditCard}
            personalLoan={inputs.personalLoan}
            additionalCommitments={inputs.additionalCommitments}
            onInputChange={handleCommitmentInput}
            onAddCommitment={onAddCommitment}
            onRemoveCommitment={onRemoveCommitment}
            onUpdateCommitment={onUpdateCommitment}
            totalBankCommitments={totalBankCommitments}
            language={language}
          />

          <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">{t.savings.title}</h2>
          <input
            type="text"
            placeholder="0"
            value={formatInputValue(inputs.monthlySavings)}
            onChange={(e) =>
              handleNumberInput('monthlySavings', e.target.value)
            }
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className={`rounded-lg p-4 transition-colors ${
          inputs.requiresDownPayment ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'
        }`}>
          <label className="flex items-start cursor-pointer hover:bg-white/50 p-2 rounded-lg transition-colors">
            <input
              type="checkbox"
              checked={inputs.requiresDownPayment}
              onChange={(e) => onInputChange('requiresDownPayment', e.target.checked)}
              className={`w-4 h-4 rounded mt-0.5 ${
                inputs.requiresDownPayment ? 'text-blue-600' : 'text-gray-400'
              }`}
            />
            <div className="ml-3 flex-1">
              <span className="text-sm font-semibold text-gray-800">{t.downPaymentToggle.label}</span>
              <p className="text-xs text-gray-600 mt-1">{t.downPaymentToggle.helperText}</p>
            </div>
          </label>
        </div>

        {inputs.isJointLoan && inputs.coApplicant && onCoApplicantChange && onCoApplicantIncomeChange && (
          <CoApplicantSection
            coApplicant={inputs.coApplicant}
            onCoApplicantChange={onCoApplicantChange}
            onCoApplicantIncomeChange={onCoApplicantIncomeChange}
            onAddCoApplicantCommitment={onAddCoApplicantCommitment || (() => {})}
            onRemoveCoApplicantCommitment={onRemoveCoApplicantCommitment || (() => {})}
            onUpdateCoApplicantCommitment={onUpdateCoApplicantCommitment || (() => {})}
            totalBankCommitments={coApplicantTotalCommitments}
            language={language}
            selectedYear={inputs.selectedYear}
          />
        )}

        <div className="space-y-3 pt-6 border-t-2 border-gray-300">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">
                {t.summary.totalCommitments}:
              </span>
              <span className="text-lg font-bold text-gray-800">
                RM {formatCurrency(totalBankCommitments)}
              </span>
            </div>
          </div>
          <div className={`rounded-lg p-4 ${
            remainingIncome < 0
              ? 'bg-red-100 border-2 border-red-500'
              : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">
                {t.summary.remainingIncome}:
              </span>
              <span
                className={`text-lg font-bold ${
                  remainingIncome >= 0 ? 'text-green-700' : 'text-red-700'
                }`}
              >
                RM {formatCurrency(remainingIncome)}
              </span>
            </div>
            {remainingIncome < 0 && (
              <div className="mt-3 flex items-start gap-2 text-red-700">
                <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium leading-snug">
                  {t.summary.remainingIncomeNegativeWarning}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleToggleJointLoan}
              className={`py-3 md:py-4 font-semibold rounded-lg transition-all duration-200 hover:shadow-lg min-h-[44px] flex items-center justify-center gap-2 ${
                inputs.isJointLoan
                  ? 'bg-gray-400 hover:bg-gray-500 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              <Users size={20} />
              {inputs.isJointLoan ? t.buttons.removeJointLoan : t.buttons.addJointLoan}
            </button>
            <button
              onClick={onCheckEligibility}
              className="py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg min-h-[44px]"
            >
              {t.buttons.checkEligibility}
            </button>
          </div>
          <button
            onClick={handleResetClick}
            className="w-full py-3 md:py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg min-h-[44px]"
          >
            {t.buttons.reset}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
