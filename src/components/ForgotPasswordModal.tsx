import { useState, useEffect } from 'react';
import { X, Mail, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { resetPassword } from '../lib/supabase';
import { Language, translations } from '../translations';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onBackToSignIn: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  language,
  onBackToSignIn,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const t = translations[language];

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setError('');
      setIsSuccess(false);
      setResendCountdown(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError(t.auth.errors.emailRequired);
      return;
    }

    if (!validateEmail(email)) {
      setError(t.auth.errors.invalidEmail);
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(email);
      setIsSuccess(true);
      setResendCountdown(60);
    } catch (err: any) {
      if (err.message?.includes('rate_limit')) {
        setError(t.auth.errors.rateLimitExceeded);
      } else {
        setError(t.auth.errors.resetPasswordFailed);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;

    setIsLoading(true);
    setError('');

    try {
      await resetPassword(email);
      setResendCountdown(60);
    } catch (err: any) {
      if (err.message?.includes('rate_limit')) {
        setError(t.auth.errors.rateLimitExceeded);
      } else {
        setError(t.auth.errors.resetPasswordFailed);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    onClose();
    onBackToSignIn();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          disabled={isLoading}
        >
          <X size={20} className="text-gray-500" />
        </button>

        <div className="p-8">
          {!isSuccess ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Mail size={32} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {t.auth.forgotPasswordTitle}
                </h2>
                <p className="text-gray-600 text-sm">
                  {t.auth.forgotPasswordSubtitle}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.auth.email}
                  </label>
                  <div className="relative">
                    <Mail
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="name@example.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>{t.auth.forgotPasswordButton}...</span>
                    </>
                  ) : (
                    <span>{t.auth.forgotPasswordButton}</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBackToSignIn}
                  disabled={isLoading}
                  className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-50"
                >
                  <ArrowLeft size={16} />
                  <span>{t.auth.backToSignIn}</span>
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {t.auth.resetEmailSent}
              </h2>

              <p className="text-gray-600 mb-2">
                {t.auth.resetEmailInstruction}
              </p>

              <p className="text-sm text-gray-500 mb-8">
                {email}
              </p>

              <div className="space-y-3">
                {resendCountdown > 0 ? (
                  <div className="text-sm text-gray-500">
                    {t.auth.waitBeforeResend.replace('{{seconds}}', resendCountdown.toString())}
                  </div>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={isLoading}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>{t.auth.resendEmail}...</span>
                      </>
                    ) : (
                      <span>{t.auth.resendEmail}</span>
                    )}
                  </button>
                )}

                <button
                  onClick={handleBackToSignIn}
                  className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  <ArrowLeft size={16} />
                  <span>{t.auth.backToSignIn}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
