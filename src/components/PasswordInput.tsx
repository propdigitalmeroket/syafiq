import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import {
  validatePasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
  PasswordStrength
} from '../utils/passwordValidation';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  showStrengthIndicator?: boolean;
  required?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = 'Enter password',
  label = 'Password',
  showStrengthIndicator = true,
  required = false,
  onValidationChange
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const strength: PasswordStrength = validatePasswordStrength(value);

  const handleChange = (newValue: string) => {
    onChange(newValue);
    if (onValidationChange) {
      const validation = validatePasswordStrength(newValue);
      onValidationChange(validation.isValid);
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  const shouldShowFeedback = isTouched && value.length > 0;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {showStrengthIndicator && value.length > 0 && (
        <>
          <div className="flex gap-1">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  index < strength.score
                    ? getPasswordStrengthColor(strength.score)
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">
              Strength: {getPasswordStrengthLabel(strength.score)}
            </span>
          </div>

          {shouldShowFeedback && strength.feedback.length > 0 && (
            <div className="space-y-1">
              {strength.feedback.map((feedback, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 text-xs ${
                    strength.isValid ? 'text-green-600' : 'text-orange-600'
                  }`}
                >
                  {strength.isValid ? (
                    <CheckCircle size={14} className="mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  )}
                  <span>{feedback}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
