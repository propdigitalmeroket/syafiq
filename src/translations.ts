export type Language = 'ms' | 'en';

export interface Translations {
  header: {
    title: string;
    subtitle: string;
  };
  income: {
    title: string;
    monthlyGrossSalary: string;
    fixedSalary: string;
    selfEmployed: string;
    commissionBased: string;
    governmentEmployee: string;
    epfContribution: string;
    incomeTaxPayment: string;
    addOtherIncome: string;
    annualBonus: string;
    bonusNote: string;
    passiveIncome: string;
    passiveIncomeNote: string;
    rental: string;
    otherPassive: string;
    dividendIncome: string;
    dividendNote: string;
    tabungHajiDividend: string;
    asbDividend: string;
    hustleIncome: string;
    hustleNote: string;
    epfContributionShort: string;
    commissionIncome: string;
    commissionNote: string;
    fixedAllowance: string;
    fixedAllowanceNote: string;
    useLPPSA: string;
    lppsaNote: string;
    totalMonthlyIncome: string;
    grossIncome: string;
    netIncome: string;
    epfDeduction: string;
    taxDeduction: string;
    hustleIncomeWarning: string;
  };
  commitments: {
    title: string;
    carLoan: string;
    creditCard: string;
    personalLoan: string;
    addOtherCommitment: string;
    totalCommitments: string;
    personalLoanSecond: string;
    carLoanSecond: string;
    housingLoan: string;
    asbLoan: string;
    creditCardCommitment: string;
    additionalCreditCard: string;
    medicalLoan: string;
    businessLoan: string;
    other: string;
  };
  savings: {
    title: string;
    currentSavings: string;
  };
  downPaymentToggle: {
    label: string;
    helperText: string;
  };
  summary: {
    totalCommitments: string;
    remainingIncome: string;
    remainingIncomeNegativeWarning: string;
  };
  results: {
    maxPropertyPrice: string;
    recommendedMonthlyPayment: string;
    downPayment: string;
    totalLoan: string;
    remainingAfterLoan: string;
    interestRate: string;
    loanPeriod: string;
    years: string;
    dsrStatus: string;
    suitable: string;
    moderate: string;
    notSuitable: string;
    dsrWarning: string;
    recommendedBanks: string;
    betterRateBadge: string;
    savingsVsPrice: string;
    lppsaCalculation: string;
    commercialBankCalculation: string;
    dsrLimit: string;
    interestRateLabel: string;
    bankReasons: {
      governmentEmployee: string;
      selfEmployed: string;
      commissionBased: string;
      lowDSR: string;
      moderateDSR: string;
      highDSR: string;
      flexibleDSR: string;
      belowMinIncome: string;
      general: string;
    };
    incomeBreakdown: string;
    beforeLoan: string;
    afterLoan: string;
    dsr: string;
    commitments: string;
    loanPayment: string;
    remaining: string;
  };
  buttons: {
    reset: string;
    confirmReset: string;
    cancel: string;
    confirm: string;
    checkEligibility: string;
    addJointLoan: string;
    removeJointLoan: string;
  };
  jointLoan: {
    title: string;
    mainApplicant: string;
    coApplicant: string;
    coApplicantInfo: string;
    helperText: string;
    combinedIncome: string;
    combinedCommitments: string;
    individualDSR: string;
    combinedDSR: string;
    affordabilityIncrease: string;
  };
  dialogs: {
    resetTitle: string;
    resetMessage: string;
  };
  auth: {
    signIn: string;
    signUp: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    forgotPassword: string;
    forgotPasswordTitle: string;
    forgotPasswordSubtitle: string;
    forgotPasswordButton: string;
    backToSignIn: string;
    resetEmailSent: string;
    resetEmailInstruction: string;
    resendEmail: string;
    waitBeforeResend: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    termsAgree: string;
    signInButton: string;
    signUpButton: string;
    welcomeBack: string;
    joinMovement: string;
    orSignInWith: string;
    orSignUpWith: string;
    errors: {
      invalidEmail: string;
      passwordTooShort: string;
      passwordsDontMatch: string;
      emailRequired: string;
      passwordRequired: string;
      nameRequired: string;
      termsRequired: string;
      signInFailed: string;
      signUpFailed: string;
      emailExists: string;
      resetPasswordFailed: string;
      rateLimitExceeded: string;
      emailNotConfirmed: string;
      invalidCredentials: string;
      userNotFound: string;
      accountLocked: string;
      resendConfirmation: string;
    };
  };
  settings: {
    title: string;
    language: string;
    theme: string;
    currency: string;
    notifications: string;
    light: string;
    dark: string;
    profile: string;
    savedCalculations: string;
    signOut: string;
    whatsNew: string;
  };
}

export const translations: Record<Language, Translations> = {
  ms: {
    header: {
      title: 'Harga Rumah Yang Layak Beli',
      subtitle: 'Kira Kelayakan Rumah Anda Dalam 3 Minit',
    },
    income: {
      title: 'PENDAPATAN',
      monthlyGrossSalary: 'Gaji Kasar Bulanan (RM)',
      fixedSalary: 'Gaji Tetap',
      selfEmployed: 'Bekerja Sendiri',
      commissionBased: 'Berasaskan Komisen',
      governmentEmployee: 'Kakitangan Kerajaan',
      epfContribution: 'Caruman KWSP',
      incomeTaxPayment: 'Pembayaran cukai pendapatan (PCB)',
      addOtherIncome: 'Tambah Pendapatan Lain',
      annualBonus: 'Bonus Tahunan',
      bonusNote: '*bank kira 50% sahaja dari bonus',
      passiveIncome: 'Pendapatan Pasif',
      passiveIncomeNote: '*bank kira 70% sahaja (1 bulan RM berapa)',
      rental: 'SEWA',
      otherPassive: 'Lain-lain Pasif',
      dividendIncome: 'Pendapatan Pasif Dividen',
      dividendNote: '*bank kira 100% (Tambah dalam 6 bulan)',
      tabungHajiDividend: 'Tabung Haji Dividen',
      asbDividend: 'ASB Dividen',
      hustleIncome: 'Pendapatan Hustle',
      hustleNote: '*bank hanya kira jika ada caruman KWSP atau cukai (6 bulan)',
      epfContributionShort: 'Caruman KWSP (?)',
      commissionIncome: 'Pendapatan Komisen',
      commissionNote: '*bank kira 75% (60-70% bergantung bank) - masukkan 6 bulan',
      fixedAllowance: 'Elaun Tetap',
      fixedAllowanceNote: '*Elaun tetap yang diterima setiap bulan',
      useLPPSA: 'Gunakan Pengiraan LPPSA',
      lppsaNote: 'DSR maksimum 60% untuk LPPSA berbanding 70% untuk bank komersial',
      totalMonthlyIncome: 'Jumlah Pendapatan Bulanan',
      grossIncome: 'Pendapatan Kasar',
      netIncome: 'Pendapatan Bersih',
      epfDeduction: 'Potongan KWSP (11%)',
      taxDeduction: 'Potongan Cukai Pendapatan',
      hustleIncomeWarning: 'Bank tidak akan kira pendapatan hustle ini kerana tiada caruman KWSP atau cukai',
    },
    commitments: {
      title: 'KOMITMEN',
      carLoan: 'Pinjaman Kereta (RM)',
      creditCard: 'Pinjaman Pendidikan / PTPTN (RM)',
      personalLoan: 'Pinjaman Peribadi (RM)',
      addOtherCommitment: 'Tambah Komitmen Lain',
      totalCommitments: 'Jumlah Komitmen Bank',
      personalLoanSecond: 'Pinjaman Peribadi Kedua',
      carLoanSecond: 'Pinjaman Kereta Kedua',
      housingLoan: 'Pinjaman Perumahan',
      asbLoan: 'Pinjaman ASB',
      creditCardCommitment: 'Kad Kredit',
      additionalCreditCard: 'Kad Kredit Tambahan',
      medicalLoan: 'Pinjaman Perubatan',
      businessLoan: 'Pinjaman Perniagaan',
      other: 'Lain-lain',
    },
    savings: {
      title: 'SIMPANAN SEMASA',
      currentSavings: 'Simpanan Semasa',
    },
    downPaymentToggle: {
      label: 'Bayar Wang Pendahuluan 10%?',
      helperText: 'Sesetengah pemaju tidak memerlukan bayaran pendahuluan',
    },
    summary: {
      totalCommitments: 'Jumlah Komitmen Bank',
      remainingIncome: 'Baki Pendapatan',
      remainingIncomeNegativeWarning:
        'Komitmen anda melebihi pendapatan! Sila kurangkan komitmen atau tambah pendapatan.',
    },
    results: {
      maxPropertyPrice: 'Harga Maksimum Rumah Mampu Milik',
      recommendedMonthlyPayment: 'Ansuran Bulanan Mengikut Tempoh Pinjaman',
      downPayment: 'Bayaran Pendahuluan',
      totalLoan: 'Jumlah Pinjaman',
      remainingAfterLoan: 'Duit Baki Selepas Bayar Loan',
      interestRate: 'Kadar Faedah',
      loanPeriod: 'Tempoh Pinjaman',
      years: 'tahun',
      dsrStatus: 'Status DSR Semasa',
      suitable: 'Sesuai',
      moderate: 'Sederhana',
      notSuitable: 'Tidak Layak',
      dsrWarning:
        'DSR anda {{dsr}}%. Cuba kurangkan komitmen untuk meningkatkan kelayakan anda.',
      recommendedBanks: 'Cadangan Bank',
      betterRateBadge: 'Kadar Istimewa!',
      savingsVsPrice: 'Simpanan vs Harga Rumah',
      lppsaCalculation: 'Pengiraan LPPSA',
      commercialBankCalculation: 'Pengiraan Bank Komersial',
      dsrLimit: 'Had DSR',
      interestRateLabel: 'Kadar Faedah',
      bankReasons: {
        governmentEmployee: 'Sesuai untuk kakitangan kerajaan',
        selfEmployed: 'Sesuai untuk bekerja sendiri',
        commissionBased: 'Sesuai untuk pendapatan komisen',
        lowDSR: 'Sesuai untuk DSR rendah dengan kadar terbaik',
        moderateDSR: 'Sesuai untuk DSR sederhana',
        highDSR: 'Fleksibel untuk DSR tinggi',
        flexibleDSR: 'Bank fleksibel untuk DSR tinggi',
        belowMinIncome: 'Pendapatan minimum tidak mencukupi',
        general: 'Bank komersial pilihan',
      },
      incomeBreakdown: 'Pecahan Pendapatan',
      beforeLoan: 'Sebelum Tambah Pinjaman Rumah',
      afterLoan: 'Selepas Tambah Pinjaman Rumah',
      dsr: 'DSR',
      commitments: 'Komitmen',
      loanPayment: 'Bayaran Loan',
      remaining: 'Baki',
    },
    buttons: {
      reset: 'Set Semula',
      confirmReset: 'Pengesahan',
      cancel: 'Batal',
      confirm: 'Ya, Set Semula',
      checkEligibility: 'Kira Kelayakan',
      addJointLoan: 'Joint Loan',
      removeJointLoan: 'Buang Joint Loan',
    },
    jointLoan: {
      title: 'Permohonan Pinjaman Bersama',
      mainApplicant: 'Pemohon Utama',
      coApplicant: 'Pemohon Bersama',
      coApplicantInfo: 'Maklumat Pemohon Bersama',
      helperText: 'Gabungkan pendapatan dengan pasangan atau ahli keluarga untuk meningkatkan kelayakan pinjaman anda',
      combinedIncome: 'Pendapatan Gabungan',
      combinedCommitments: 'Komitmen Gabungan',
      individualDSR: 'DSR Individu',
      combinedDSR: 'DSR Gabungan',
      affordabilityIncrease: 'Peningkatan Kelayakan',
    },
    dialogs: {
      resetTitle: 'Set Semula Kalkulator?',
      resetMessage:
        'Adakah anda pasti mahu menetapkan semula semua nilai kepada nilai awal? Tindakan ini tidak boleh dibatalkan.',
    },
    auth: {
      signIn: 'Log Masuk',
      signUp: 'Daftar',
      email: 'E-mel',
      password: 'Kata Laluan',
      confirmPassword: 'Sahkan Kata Laluan',
      fullName: 'Nama Penuh',
      forgotPassword: 'Lupa Kata Laluan?',
      forgotPasswordTitle: 'Lupa Kata Laluan?',
      forgotPasswordSubtitle: 'Masukkan e-mel anda dan kami akan hantar pautan untuk set semula kata laluan.',
      forgotPasswordButton: 'Hantar Pautan Reset',
      backToSignIn: 'Kembali ke Log Masuk',
      resetEmailSent: 'E-mel Telah Dihantar!',
      resetEmailInstruction: 'Sila semak inbox anda untuk pautan reset kata laluan.',
      resendEmail: 'Hantar Semula',
      waitBeforeResend: 'Tunggu {{seconds}} saat sebelum hantar semula',
      alreadyHaveAccount: 'Sudah ada akaun?',
      dontHaveAccount: 'Belum ada akaun?',
      termsAgree: 'Saya bersetuju dengan terma dan syarat',
      signInButton: 'Log Masuk',
      signUpButton: 'Daftar Akaun',
      welcomeBack: 'Selamat Kembali',
      joinMovement: 'Sertai Kami',
      orSignInWith: 'Atau log masuk dengan',
      orSignUpWith: 'Atau daftar dengan',
      errors: {
        invalidEmail: 'Format e-mel tidak sah',
        passwordTooShort: 'Kata laluan mestilah sekurang-kurangnya 8 aksara',
        passwordsDontMatch: 'Kata laluan tidak sepadan',
        emailRequired: 'E-mel diperlukan',
        passwordRequired: 'Kata laluan diperlukan',
        nameRequired: 'Nama penuh diperlukan',
        termsRequired: 'Anda mesti bersetuju dengan terma dan syarat',
        signInFailed: 'Log masuk gagal. Sila semak e-mel dan kata laluan anda.',
        signUpFailed: 'Pendaftaran gagal. Sila cuba lagi.',
        emailExists: 'E-mel ini sudah didaftarkan',
        resetPasswordFailed: 'Gagal hantar e-mel. Sila cuba lagi.',
        rateLimitExceeded: 'Terlalu banyak percubaan. Sila cuba sebentar lagi.',
        emailNotConfirmed: 'Sila sahkan e-mel anda terlebih dahulu. Semak inbox anda.',
        invalidCredentials: 'E-mel atau kata laluan salah. Sila cuba lagi.',
        userNotFound: 'Akaun tidak dijumpai. Sila daftar terlebih dahulu.',
        accountLocked: 'Akaun anda telah dikunci. Sila hubungi pentadbir.',
        resendConfirmation: 'Belum terima e-mel? Klik untuk hantar semula.',
      },
    },
    settings: {
      title: 'Tetapan',
      language: 'Bahasa',
      theme: 'Tema',
      currency: 'Format Mata Wang',
      notifications: 'Notifikasi',
      light: 'Terang',
      dark: 'Gelap',
      profile: 'Profil Saya',
      savedCalculations: 'Pengiraan Tersimpan',
      signOut: 'Log Keluar',
      whatsNew: 'Ciri Baharu',
    },
  },
  en: {
    header: {
      title: 'Affordable House Price Calculator',
      subtitle: 'Calculate Your Property Eligibility in 3 Minutes',
    },
    income: {
      title: 'INCOME',
      monthlyGrossSalary: 'Monthly Gross Salary (RM)',
      fixedSalary: 'Fixed Salary',
      selfEmployed: 'Self Employed',
      commissionBased: 'Commission Based',
      governmentEmployee: 'Government Employee',
      epfContribution: 'EPF Contribution',
      incomeTaxPayment: 'Income tax payment (PCB)',
      addOtherIncome: 'Add Other Income',
      annualBonus: 'Annual Bonus',
      bonusNote: '*bank calculates 50% only from bonus',
      passiveIncome: 'Passive Income',
      passiveIncomeNote: '*bank calculates 70% only (monthly amount in RM)',
      rental: 'RENTAL',
      otherPassive: 'Other Passive',
      dividendIncome: 'Dividend Passive Income',
      dividendNote: '*bank calculates 100% (added in last 6 months)',
      tabungHajiDividend: 'Tabung Haji Dividend',
      asbDividend: 'ASB Dividend',
      hustleIncome: 'Hustle Income',
      hustleNote: '*bank only calculates if there is EPF or tax (6 months)',
      epfContributionShort: 'EPF Contribution (?)',
      commissionIncome: 'Commission Income',
      commissionNote: '*bank calculates 75% (60-70% depending on bank) - enter 6 months',
      fixedAllowance: 'Fixed Allowance',
      fixedAllowanceNote: '*Fixed allowance received monthly',
      useLPPSA: 'Use LPPSA Calculation',
      lppsaNote: 'Maximum DSR 60% for LPPSA compared to 70% for commercial banks',
      totalMonthlyIncome: 'Total Monthly Income',
      grossIncome: 'Gross Income',
      netIncome: 'Net Income',
      epfDeduction: 'EPF Deduction (11%)',
      taxDeduction: 'Income Tax Deduction',
      hustleIncomeWarning: 'Bank will not calculate this hustle income because there is no EPF contribution or tax payment',
    },
    commitments: {
      title: 'COMMITMENTS',
      carLoan: 'Car Loan (RM)',
      creditCard: 'Education Loan / PTPTN (RM)',
      personalLoan: 'Personal Loan (RM)',
      addOtherCommitment: 'Add Other Commitment',
      totalCommitments: 'Total Bank Commitments',
      personalLoanSecond: 'Second Personal Loan',
      carLoanSecond: 'Second Car Loan',
      housingLoan: 'Housing Loan',
      asbLoan: 'ASB Loan',
      creditCardCommitment: 'Credit Card',
      additionalCreditCard: 'Additional Credit Card',
      medicalLoan: 'Medical Loan',
      businessLoan: 'Business Loan',
      other: 'Others',
    },
    savings: {
      title: 'CURRENT SAVINGS',
      currentSavings: 'Current Savings',
    },
    downPaymentToggle: {
      label: 'Pay 10% Down Payment?',
      helperText: 'Some developers do not require down payment',
    },
    summary: {
      totalCommitments: 'Total Bank Commitments',
      remainingIncome: 'Remaining Income',
      remainingIncomeNegativeWarning:
        'Your commitments exceed your income! Please reduce commitments or increase income.',
    },
    results: {
      maxPropertyPrice: 'Maximum Affordable Property Price',
      recommendedMonthlyPayment: 'Monthly Installment Based on Loan Period',
      downPayment: 'Down Payment',
      totalLoan: 'Total Loan Amount',
      remainingAfterLoan: 'Remaining Money After Loan Payment',
      interestRate: 'Interest Rate',
      loanPeriod: 'Loan Period',
      years: 'years',
      dsrStatus: 'Current DSR Status',
      suitable: 'Suitable',
      moderate: 'Moderate',
      notSuitable: 'Not Suitable',
      dsrWarning:
        'Your DSR is {{dsr}}%. Try reducing commitments to improve your eligibility.',
      recommendedBanks: 'Recommended Banks',
      betterRateBadge: 'Special Rate!',
      savingsVsPrice: 'Savings vs House Price',
      lppsaCalculation: 'LPPSA Calculation',
      commercialBankCalculation: 'Commercial Bank Calculation',
      dsrLimit: 'DSR Limit',
      interestRateLabel: 'Interest Rate',
      bankReasons: {
        governmentEmployee: 'Suitable for government employees',
        selfEmployed: 'Suitable for self-employed',
        commissionBased: 'Suitable for commission-based income',
        lowDSR: 'Suitable for low DSR with best rates',
        moderateDSR: 'Suitable for moderate DSR',
        highDSR: 'Flexible for high DSR',
        flexibleDSR: 'Flexible bank for high DSR',
        belowMinIncome: 'Minimum income not met',
        general: 'Preferred commercial bank',
      },
      incomeBreakdown: 'Income Breakdown',
      beforeLoan: 'Before Include Housing Loan',
      afterLoan: 'After Include Housing Loan',
      dsr: 'DSR',
      commitments: 'Commitments',
      loanPayment: 'Loan Payment',
      remaining: 'Remaining',
    },
    buttons: {
      reset: 'Reset',
      confirmReset: 'Confirmation',
      cancel: 'Cancel',
      confirm: 'Yes, Reset',
      checkEligibility: 'Check Eligibility',
      addJointLoan: 'Joint Loan',
      removeJointLoan: 'Remove Joint Loan',
    },
    jointLoan: {
      title: 'Joint Loan Application',
      mainApplicant: 'Main Applicant',
      coApplicant: 'Co-Applicant',
      coApplicantInfo: 'Co-Applicant Information',
      helperText: 'Combine income with your spouse or family member to increase your loan eligibility',
      combinedIncome: 'Combined Income',
      combinedCommitments: 'Combined Commitments',
      individualDSR: 'Individual DSR',
      combinedDSR: 'Combined DSR',
      affordabilityIncrease: 'Affordability Increase',
    },
    dialogs: {
      resetTitle: 'Reset Calculator?',
      resetMessage:
        'Are you sure you want to reset all values to their initial state? This action cannot be undone.',
    },
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      forgotPassword: 'Forgot Password?',
      forgotPasswordTitle: 'Forgot Password?',
      forgotPasswordSubtitle: 'Enter your email and we will send you a link to reset your password.',
      forgotPasswordButton: 'Send Reset Link',
      backToSignIn: 'Back to Sign In',
      resetEmailSent: 'Email Sent!',
      resetEmailInstruction: 'Please check your inbox for the password reset link.',
      resendEmail: 'Resend Email',
      waitBeforeResend: 'Wait {{seconds}} seconds before resending',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      termsAgree: 'I agree to terms and conditions',
      signInButton: 'Sign In',
      signUpButton: 'Create Account',
      welcomeBack: 'Welcome Back',
      joinMovement: 'Join the Movement',
      orSignInWith: 'Or sign in with',
      orSignUpWith: 'Or sign up with',
      errors: {
        invalidEmail: 'Invalid email format',
        passwordTooShort: 'Password must be at least 8 characters',
        passwordsDontMatch: 'Passwords do not match',
        emailRequired: 'Email is required',
        passwordRequired: 'Password is required',
        nameRequired: 'Full name is required',
        termsRequired: 'You must agree to the terms and conditions',
        signInFailed: 'Sign in failed. Please check your email and password.',
        signUpFailed: 'Sign up failed. Please try again.',
        emailExists: 'This email is already registered',
        resetPasswordFailed: 'Failed to send email. Please try again.',
        rateLimitExceeded: 'Too many attempts. Please try again later.',
        emailNotConfirmed: 'Please confirm your email first. Check your inbox.',
        invalidCredentials: 'Invalid email or password. Please try again.',
        userNotFound: 'Account not found. Please sign up first.',
        accountLocked: 'Your account has been locked. Please contact admin.',
        resendConfirmation: 'Didn\'t receive the email? Click to resend.',
      },
    },
    settings: {
      title: 'Settings',
      language: 'Language',
      theme: 'Theme',
      currency: 'Currency Format',
      notifications: 'Notifications',
      light: 'Light',
      dark: 'Dark',
      profile: 'My Profile',
      savedCalculations: 'Saved Calculations',
      signOut: 'Sign Out',
      whatsNew: "What's New",
    },
  },
};
