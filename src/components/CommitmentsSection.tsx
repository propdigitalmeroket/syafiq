import { CommitmentType, AdditionalCommitment } from '../types';
import { formatCurrency } from '../utils/calculations';
import { Plus, X } from 'lucide-react';
import { Language, translations } from '../translations';
import CustomSelect from './CustomSelect';

interface CommitmentsSectionProps {
  carLoan: number;
  creditCard: number;
  personalLoan: number;
  additionalCommitments: AdditionalCommitment[];
  onInputChange: (field: 'carLoan' | 'creditCard' | 'personalLoan', value: number) => void;
  onAddCommitment: () => void;
  onRemoveCommitment: (id: string) => void;
  onUpdateCommitment: (id: string, field: 'type' | 'amount', value: any) => void;
  totalBankCommitments: number;
  language: Language;
}

const COMMITMENT_OPTIONS: Record<CommitmentType, { ms: string; en: string }> = {
  'Personal Loan Kedua': { ms: 'Pinjaman Peribadi Kedua', en: 'Second Personal Loan' },
  'Pinjaman Kereta Kedua': { ms: 'Pinjaman Kereta Kedua', en: 'Second Car Loan' },
  'Pinjaman Loan Perumahan': { ms: 'Pinjaman Perumahan', en: 'Housing Loan' },
  'ASB Loan': { ms: 'Pinjaman ASB', en: 'ASB Loan' },
  'Credit Card': { ms: 'Kad Kredit', en: 'Credit Card' },
  'Credit Card Tambahan': { ms: 'Kad Kredit Tambahan', en: 'Additional Credit Card' },
  'Medical Loan': { ms: 'Pinjaman Perubatan', en: 'Medical Loan' },
  'Business Loan': { ms: 'Pinjaman Perniagaan', en: 'Business Loan' },
  'Lain-lain': { ms: 'Lain-lain', en: 'Others' },
};

export default function CommitmentsSection({
  carLoan,
  creditCard,
  personalLoan,
  additionalCommitments,
  onInputChange,
  onAddCommitment,
  onRemoveCommitment,
  onUpdateCommitment,
  totalBankCommitments,
  language,
}: CommitmentsSectionProps) {
  const t = translations[language];

  const handleNumberInput = (field: 'carLoan' | 'creditCard' | 'personalLoan', value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value.replace(/,/g, ''));
    if (!isNaN(numValue) && numValue >= 0) {
      onInputChange(field, numValue);
    }
  };

  const formatInputValue = (value: number): string => {
    return value === 0 ? '' : formatCurrency(value);
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">
        {t.commitments.title}
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.commitments.carLoan}
          </label>
          <input
            type="text"
            placeholder="0"
            value={formatInputValue(carLoan)}
            onChange={(e) => handleNumberInput('carLoan', e.target.value)}
            className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.commitments.creditCard}
          </label>
          <input
            type="text"
            placeholder="0"
            value={formatInputValue(creditCard)}
            onChange={(e) => handleNumberInput('creditCard', e.target.value)}
            className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.commitments.personalLoan}
          </label>
          <input
            type="text"
            placeholder="0"
            value={formatInputValue(personalLoan)}
            onChange={(e) => handleNumberInput('personalLoan', e.target.value)}
            className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {additionalCommitments.map((commitment) => (
          <div
            key={commitment.id}
            className="flex flex-col sm:flex-row gap-2 animate-in slide-in-from-top-2 fade-in duration-300"
          >
            <CustomSelect
              value={commitment.type}
              onValueChange={(value) => onUpdateCommitment(commitment.id, 'type', value as CommitmentType)}
              options={Object.entries(COMMITMENT_OPTIONS).map(([key, value]) => ({
                value: key,
                label: value[language],
              }))}
              className="flex-1 max-w-full text-sm"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="0"
                value={formatInputValue(commitment.amount)}
                onChange={(e) => {
                  const numValue = e.target.value === '' ? 0 : parseFloat(e.target.value.replace(/,/g, ''));
                  if (!isNaN(numValue) && numValue >= 0) {
                    onUpdateCommitment(commitment.id, 'amount', numValue);
                  }
                }}
                className="flex-1 sm:w-40 min-w-0 px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={() => onRemoveCommitment(commitment.id)}
                className="px-3 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-all hover:scale-105 min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
                aria-label="Remove commitment"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onAddCommitment}
        disabled={additionalCommitments.length >= 10}
        className="mt-4 flex items-center gap-2 text-[#2C3E7C] hover:text-blue-800 font-medium transition-all hover:gap-3 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
      >
        <Plus size={20} />
        {t.commitments.addOtherCommitment}
      </button>

      <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-800">{t.commitments.totalCommitments}:</span>
          <span className="text-orange-700 text-lg font-bold">RM {formatCurrency(totalBankCommitments)}</span>
        </div>
      </div>
    </div>
  );
}
