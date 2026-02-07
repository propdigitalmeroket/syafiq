import { useState, useEffect, useMemo, useRef } from 'react';
import { CalculatorInputs, IncomeBreakdown, CoApplicantData } from './types';
import InputPanel from './components/InputPanel';
import ResultsPanel from './components/ResultsPanel';
import { calculateResults } from './utils/calculations';
import { Language, translations } from './translations';
import { Settings, User as UserIcon } from 'lucide-react';
import { fetchBanksFromDatabase, SupabaseBankProfile, getCurrentUser, onAuthStateChange, signOut as supabaseSignOut } from './lib/supabase';
import SettingsMenu from './components/SettingsMenu';
import SignInModal from './components/SignInModal';
import SignUpModal from './components/SignUpModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import WhatsNewModal from './components/WhatsNewModal';
import { User } from '@supabase/supabase-js';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/localStorage';

const createDefaultCoApplicant = (): CoApplicantData => ({
  income: {
    monthlyGrossSalary: 0,
    employmentType: 'Fixed Salary',
    hasKWSP: false,
    hasTax: false,
    annualBonus: 0,
    bonusYear: new Date().getFullYear(),
    passiveIncome: 0,
    passiveIncomeType: 'RENTAL',
    dividendPassiveIncome: 0,
    dividendType: 'Tabung Haji Dividend',
    hustleIncome: 0,
    hustleHasKWSP: false,
    hustleHasTax: false,
    commissionIncome: 0,
    fixedAllowance: 0,
    useLPPSA: false,
  },
  showAdditionalIncome: false,
  carLoan: 0,
  creditCard: 0,
  personalLoan: 0,
  additionalCommitments: [],
  monthlySavings: 0,
});

const initialInputs: CalculatorInputs = {
  income: {
    monthlyGrossSalary: 5000,
    employmentType: 'Fixed Salary',
    hasKWSP: false,
    hasTax: false,
    annualBonus: 0,
    bonusYear: new Date().getFullYear(),
    passiveIncome: 0,
    passiveIncomeType: 'RENTAL',
    dividendPassiveIncome: 0,
    dividendType: 'Tabung Haji Dividend',
    hustleIncome: 0,
    hustleHasKWSP: false,
    hustleHasTax: false,
    commissionIncome: 0,
    fixedAllowance: 0,
    useLPPSA: false,
  },
  selectedYear: new Date().getFullYear(),
  showAdditionalIncome: false,
  carLoan: 0,
  creditCard: 0,
  personalLoan: 0,
  additionalCommitments: [],
  monthlySavings: 0,
  loanTerm: 30,
  requiresDownPayment: false,
  isJointLoan: false,
  coApplicant: undefined,
};

function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const savedData = loadFromLocalStorage();
    return savedData?.language || 'ms';
  });
  const [inputs, setInputs] = useState<CalculatorInputs>(() => {
    const savedData = loadFromLocalStorage();
    if (savedData?.inputs) {
      return {
        ...savedData.inputs,
        requiresDownPayment: savedData.inputs.requiresDownPayment ?? false,
      };
    }
    return initialInputs;
  });
  const [banks, setBanks] = useState<SupabaseBankProfile[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isWhatsNewModalOpen, setIsWhatsNewModalOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [authNotification, setAuthNotification] = useState<string>('');
  const [highlightResults, setHighlightResults] = useState(false);
  const resultsPanelRef = useRef<HTMLDivElement>(null);

  const t = translations[language];

  useEffect(() => {
    async function loadBanks() {
      setIsLoadingBanks(true);
      try {
        const bankData = await fetchBanksFromDatabase();
        setBanks(bankData);
      } catch (error) {
        console.error('Failed to load banks:', error);
      } finally {
        setIsLoadingBanks(false);
      }
    }
    loadBanks();
  }, []);

  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser();
      setCurrentUser(user);
    }
    checkAuth();

    const { data: { subscription } } = onAuthStateChange((user) => {
      setCurrentUser(user);

      if (user && !currentUser) {
        const welcomeMessage = language === 'ms'
          ? `Selamat datang, ${user.user_metadata?.full_name || user.email}!`
          : `Welcome, ${user.user_metadata?.full_name || user.email}!`;
        setAuthNotification(welcomeMessage);
        setTimeout(() => setAuthNotification(''), 5000);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser, language]);

  useEffect(() => {
    saveToLocalStorage(inputs, language);
  }, [inputs, language]);

  const coApplicantTotalCommitments = useMemo(() => {
    if (!inputs.coApplicant) return 0;
    const additionalSum = inputs.coApplicant.additionalCommitments.reduce(
      (sum, c) => sum + c.amount,
      0
    );
    return (
      inputs.coApplicant.carLoan +
      inputs.coApplicant.creditCard +
      inputs.coApplicant.personalLoan +
      additionalSum
    );
  }, [inputs.coApplicant]);

  const results = useMemo(() => {
    return calculateResults(inputs, banks);
  }, [inputs, banks]);

  const handleInputChange = (field: keyof CalculatorInputs, value: any) => {
    setInputs((prev) => {
      if (field === 'isJointLoan' && value === true && !prev.coApplicant) {
        return {
          ...prev,
          [field]: value,
          coApplicant: createDefaultCoApplicant(),
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleIncomeChange = (field: keyof IncomeBreakdown, value: number) => {
    setInputs((prev) => ({
      ...prev,
      income: {
        ...prev.income,
        [field]: value,
      },
    }));
  };

  const handleAddCommitment = () => {
    if (inputs.additionalCommitments.length < 10) {
      setInputs((prev) => ({
        ...prev,
        additionalCommitments: [
          ...prev.additionalCommitments,
          {
            id: Date.now().toString(),
            type: 'Personal Loan',
            amount: 0,
          },
        ],
      }));
    }
  };

  const handleRemoveCommitment = (id: string) => {
    setInputs((prev) => ({
      ...prev,
      additionalCommitments: prev.additionalCommitments.filter(
        (c) => c.id !== id
      ),
    }));
  };

  const handleUpdateCommitment = (
    id: string,
    field: 'type' | 'amount',
    value: any
  ) => {
    setInputs((prev) => ({
      ...prev,
      additionalCommitments: prev.additionalCommitments.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    }));
  };

  const handleCoApplicantChange = (field: keyof CoApplicantData, value: any) => {
    setInputs((prev) => ({
      ...prev,
      coApplicant: prev.coApplicant ? {
        ...prev.coApplicant,
        [field]: value,
      } : undefined,
    }));
  };

  const handleCoApplicantIncomeChange = (field: keyof IncomeBreakdown, value: number | string | boolean) => {
    setInputs((prev) => ({
      ...prev,
      coApplicant: prev.coApplicant ? {
        ...prev.coApplicant,
        income: {
          ...prev.coApplicant.income,
          [field]: value,
        },
      } : undefined,
    }));
  };

  const handleAddCoApplicantCommitment = () => {
    setInputs((prev) => {
      if (!prev.coApplicant || prev.coApplicant.additionalCommitments.length >= 10) {
        return prev;
      }
      return {
        ...prev,
        coApplicant: {
          ...prev.coApplicant,
          additionalCommitments: [
            ...prev.coApplicant.additionalCommitments,
            {
              id: Date.now().toString(),
              type: 'Personal Loan',
              amount: 0,
            },
          ],
        },
      };
    });
  };

  const handleRemoveCoApplicantCommitment = (id: string) => {
    setInputs((prev) => ({
      ...prev,
      coApplicant: prev.coApplicant ? {
        ...prev.coApplicant,
        additionalCommitments: prev.coApplicant.additionalCommitments.filter(
          (c) => c.id !== id
        ),
      } : undefined,
    }));
  };

  const handleUpdateCoApplicantCommitment = (
    id: string,
    field: 'type' | 'amount',
    value: any
  ) => {
    setInputs((prev) => ({
      ...prev,
      coApplicant: prev.coApplicant ? {
        ...prev.coApplicant,
        additionalCommitments: prev.coApplicant.additionalCommitments.map((c) =>
          c.id === id ? { ...c, [field]: value } : c
        ),
      } : undefined,
    }));
  };

  const handleReset = () => {
    setInputs(initialInputs);
  };

  const handleInterestRateChange = (value: number | undefined) => {
    setInputs((prev) => ({
      ...prev,
      manualInterestRate: value,
    }));
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ms' ? 'en' : 'ms'));
  };

  const handleSignOut = async () => {
    try {
      await supabaseSignOut();
      setCurrentUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setIsSignInModalOpen(false);
    setIsSignUpModalOpen(false);
  };

  const getUserInitial = () => {
    if (!currentUser) return '';
    const name = currentUser.user_metadata?.full_name || currentUser.email || '';
    return name.charAt(0).toUpperCase();
  };

  const handleCheckEligibility = () => {
    resultsPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setHighlightResults(true);
    setTimeout(() => setHighlightResults(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {authNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slideIn">
          {authNotification}
        </div>
      )}

      <header className="bg-[#2C3E7C] text-white py-6 sm:py-8 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity duration-200 cursor-pointer group"
              aria-label="Reset calculator"
            >
              <img
                src="/logo_rumah_advisor.png"
                alt="Rumah Advisor Logo"
                className="h-8 sm:h-10 md:h-12 w-auto transition-transform duration-200 group-hover:scale-105"
              />
              <div className="flex items-baseline gap-1 hidden sm:flex">
                <span className="text-lg md:text-xl lg:text-2xl font-light">rumah</span>
                <span className="text-lg md:text-xl lg:text-2xl font-bold">Advisor</span>
              </div>
            </button>
            <div className="flex items-center gap-2 sm:gap-3 relative">
              {currentUser ? (
                <>
                  <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 bg-white/10 rounded-lg border border-white/20">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-semibold">
                      {getUserInitial()}
                    </div>
                    <span className="text-sm font-medium hidden sm:inline">
                      {currentUser.user_metadata?.full_name || currentUser.email}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                    className="flex items-center gap-2 px-2 sm:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 border border-white/20"
                    aria-label="Settings"
                  >
                    <Settings size={20} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsSignInModalOpen(true)}
                    className="px-3 sm:px-4 py-2 border border-white/30 hover:bg-white/10 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
                  >
                    {t.auth.signIn}
                  </button>
                  <button
                    onClick={() => setIsSignUpModalOpen(true)}
                    className="px-3 sm:px-4 py-2 bg-white text-[#2C3E7C] hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium shadow-md text-sm sm:text-base"
                  >
                    {t.auth.signUp}
                  </button>
                  <button
                    onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                    className="flex items-center gap-2 px-2 sm:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 border border-white/20"
                    aria-label="Settings"
                  >
                    <Settings size={20} />
                  </button>
                </>
              )}
              <SettingsMenu
                isOpen={isSettingsMenuOpen}
                onClose={() => setIsSettingsMenuOpen(false)}
                language={language}
                onLanguageChange={toggleLanguage}
                t={t}
                currentUser={currentUser}
                onSignOut={handleSignOut}
                onWhatsNewClick={() => setIsWhatsNewModalOpen(true)}
              />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {t.header.title}
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              {t.header.subtitle}
            </p>
          </div>
        </div>
      </header>

      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSwitchToSignUp={() => {
          setIsSignInModalOpen(false);
          setIsSignUpModalOpen(true);
        }}
        onForgotPassword={() => {
          setIsSignInModalOpen(false);
          setIsForgotPasswordModalOpen(true);
        }}
        onSuccess={handleAuthSuccess}
        t={t}
      />

      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSwitchToSignIn={() => {
          setIsSignUpModalOpen(false);
          setIsSignInModalOpen(true);
        }}
        onSuccess={handleAuthSuccess}
        t={t}
      />

      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
        onBackToSignIn={() => {
          setIsForgotPasswordModalOpen(false);
          setIsSignInModalOpen(true);
        }}
        language={language}
      />

      <WhatsNewModal
        isOpen={isWhatsNewModalOpen}
        onClose={() => setIsWhatsNewModalOpen(false)}
        language={language}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <InputPanel
              inputs={inputs}
              onInputChange={handleInputChange}
              onIncomeChange={handleIncomeChange}
              onAddCommitment={handleAddCommitment}
              onRemoveCommitment={handleRemoveCommitment}
              onUpdateCommitment={handleUpdateCommitment}
              onReset={handleReset}
              totalBankCommitments={results.totalBankCommitments}
              totalExpenses={results.totalExpenses}
              remainingIncome={results.remainingIncome}
              language={language}
              onCheckEligibility={handleCheckEligibility}
              onCoApplicantChange={handleCoApplicantChange}
              onCoApplicantIncomeChange={handleCoApplicantIncomeChange}
              onAddCoApplicantCommitment={handleAddCoApplicantCommitment}
              onRemoveCoApplicantCommitment={handleRemoveCoApplicantCommitment}
              onUpdateCoApplicantCommitment={handleUpdateCoApplicantCommitment}
              coApplicantTotalCommitments={coApplicantTotalCommitments}
            />
          </div>
          <div className="lg:col-span-3" ref={resultsPanelRef}>
            <ResultsPanel
              results={results}
              language={language}
              onLoanTermChange={(value) => handleInputChange('loanTerm', value)}
              onInterestRateChange={handleInterestRateChange}
              useLPPSA={inputs.income.useLPPSA}
              isLoadingBanks={isLoadingBanks}
              manualInterestRate={inputs.manualInterestRate}
              shouldHighlight={highlightResults}
              requiresDownPayment={inputs.requiresDownPayment}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
