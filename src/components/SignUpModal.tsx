import { useState } from 'react';
import { X, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { Translations } from '../translations';
import { signUpWithEmail } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import PasswordInput from './PasswordInput';
import { validatePasswordStrength } from '../utils/passwordValidation';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
  onSuccess: (user: User) => void;
  t: Translations;
}

export default function SignUpModal({
  isOpen,
  onClose,
  onSwitchToSignIn,
  onSuccess,
  t,
}: SignUpModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError(t.auth.errors.nameRequired);
      return;
    }

    if (!email) {
      setError(t.auth.errors.emailRequired);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t.auth.errors.invalidEmail);
      return;
    }

    if (!password) {
      setError(t.auth.errors.passwordRequired);
      return;
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.feedback[0] || t.auth.errors.passwordTooShort);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.auth.errors.passwordsDontMatch);
      return;
    }

    if (!agreeToTerms) {
      setError(t.auth.errors.termsRequired);
      return;
    }

    setIsLoading(true);

    try {
      const { user } = await signUpWithEmail({
        email,
        password,
        fullName: fullName.trim(),
      });

      if (user) {
        onSuccess(user);
        onClose();
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAgreeToTerms(false);
      }
    } catch (err: any) {
      if (err.message?.includes('already registered')) {
        setError(t.auth.errors.emailExists);
      } else {
        setError(t.auth.errors.signUpFailed);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAgreeToTerms(false);
      setError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scaleIn max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50 z-10"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t.auth.joinMovement}
          </h2>
          <p className="text-gray-600 mb-6">
            {t.auth.alreadyHaveAccount}{' '}
            <button
              onClick={onSwitchToSignIn}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
            >
              {t.auth.signIn}
            </button>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                {t.auth.fullName}
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:bg-gray-100"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t.auth.email}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:bg-gray-100"
                placeholder="name@example.com"
              />
            </div>

            <PasswordInput
              value={password}
              onChange={setPassword}
              label={t.auth.password}
              placeholder="••••••••"
              showStrengthIndicator={true}
              required={true}
              onValidationChange={setIsPasswordValid}
            />

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t.auth.confirmPassword}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:bg-gray-100 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPassword && password === confirmPassword && (
                <div className="mt-2 flex items-center gap-1 text-green-600 text-sm">
                  <CheckCircle2 size={16} />
                  <span>Passwords match</span>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                disabled={isLoading}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                {t.auth.termsAgree}
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>{t.auth.signUpButton}...</span>
                </>
              ) : (
                <span>{t.auth.signUpButton}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
