import { useState } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Translations } from '../translations';
import { signInWithEmail, resendConfirmationEmail } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
  onForgotPassword: () => void;
  onSuccess: (user: User) => void;
  t: Translations;
}

export default function SignInModal({
  isOpen,
  onClose,
  onSwitchToSignUp,
  onForgotPassword,
  onSuccess,
  t,
}: SignInModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [isResending, setIsResending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError(t.auth.errors.emailRequired);
      return;
    }

    if (!password) {
      setError(t.auth.errors.passwordRequired);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t.auth.errors.invalidEmail);
      return;
    }

    setIsLoading(true);

    try {
      const { user } = await signInWithEmail({ email, password });
      if (user) {
        onSuccess(user);
        onClose();
        setEmail('');
        setPassword('');
        setShowResendConfirmation(false);
      }
    } catch (err: any) {
      console.log('SignIn error details:', err);

      const errorMessage = err?.message?.toLowerCase() || '';

      if (errorMessage.includes('email not confirmed') || errorMessage.includes('email_not_confirmed')) {
        setError(t.auth.errors.emailNotConfirmed);
        setShowResendConfirmation(true);
      } else if (errorMessage.includes('invalid login credentials') || errorMessage.includes('invalid_credentials')) {
        setError(t.auth.errors.invalidCredentials);
        setShowResendConfirmation(false);
      } else if (errorMessage.includes('user not found') || errorMessage.includes('user_not_found')) {
        setError(t.auth.errors.userNotFound);
        setShowResendConfirmation(false);
      } else if (errorMessage.includes('too many requests') || errorMessage.includes('rate_limit')) {
        setError(t.auth.errors.rateLimitExceeded);
        setShowResendConfirmation(false);
      } else {
        setError(t.auth.errors.signInFailed);
        setShowResendConfirmation(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError(t.auth.errors.emailRequired);
      return;
    }

    setIsResending(true);
    try {
      await resendConfirmationEmail(email);
      setError('');
      setShowResendConfirmation(false);
      alert(t.auth.resetEmailSent + ' ' + t.auth.resetEmailInstruction);
    } catch (err: any) {
      setError(t.auth.errors.resetPasswordFailed);
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail('');
      setPassword('');
      setError('');
      setShowResendConfirmation(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scaleIn">
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t.auth.welcomeBack}
          </h2>
          <p className="text-gray-600 mb-6">
            {t.auth.dontHaveAccount}{' '}
            <button
              onClick={onSwitchToSignUp}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
            >
              {t.auth.signUp}
            </button>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
                {showResendConfirmation && (
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={isResending}
                    className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm underline disabled:opacity-50"
                  >
                    {isResending ? t.auth.waitBeforeResend.replace('{{seconds}}', '...') : t.auth.errors.resendConfirmation}
                  </button>
                )}
              </div>
            )}

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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t.auth.password}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:bg-gray-100 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                disabled={isLoading}
              >
                {t.auth.forgotPassword}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>{t.auth.signInButton}...</span>
                </>
              ) : (
                <span>{t.auth.signInButton}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
