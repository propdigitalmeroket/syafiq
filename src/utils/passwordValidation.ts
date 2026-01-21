export interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

const commonPasswords = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', '1234567',
  'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
  'ashley', 'bailey', 'passw0rd', 'shadow', '123123', '654321', 'superman',
  'qazwsx', 'michael', 'football', 'password1', '12345', 'welcome', 'admin'
];

export function validatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  if (!password || password.length === 0) {
    return {
      score: 0,
      feedback: ['Password is required'],
      isValid: false
    };
  }

  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }

  if (password.length >= 12) {
    score += 1;
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include lowercase letters (a-z)');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include uppercase letters (A-Z)');
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include numbers (0-9)');
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include special characters (!@#$%^&*)');
  }

  const lowerPassword = password.toLowerCase();
  const isCommon = commonPasswords.some(common =>
    lowerPassword.includes(common) || common.includes(lowerPassword)
  );

  if (isCommon) {
    feedback.push('This password is too common. Use a more unique password');
    score = Math.max(0, score - 2);
  }

  if (/(.)\1{2,}/.test(password)) {
    feedback.push('Avoid repeated characters (e.g., "aaa", "111")');
    score = Math.max(0, score - 1);
  }

  if (/^[0-9]+$/.test(password)) {
    feedback.push('Password cannot be only numbers');
    score = 0;
  }

  const sequentialPatterns = ['123', '234', '345', '456', '567', '678', '789',
                               'abc', 'bcd', 'cde', 'def', 'efg', 'fgh'];
  const hasSequential = sequentialPatterns.some(pattern =>
    lowerPassword.includes(pattern)
  );

  if (hasSequential) {
    feedback.push('Avoid sequential characters (e.g., "123", "abc")');
    score = Math.max(0, score - 1);
  }

  const isValid = score >= 4 && password.length >= 8 && feedback.length === 0;

  if (isValid && feedback.length === 0) {
    feedback.push('Strong password!');
  }

  return {
    score: Math.min(5, score),
    feedback,
    isValid
  };
}

export function getPasswordStrengthLabel(score: number): string {
  if (score === 0) return 'Very Weak';
  if (score === 1) return 'Weak';
  if (score === 2) return 'Fair';
  if (score === 3) return 'Good';
  if (score === 4) return 'Strong';
  return 'Very Strong';
}

export function getPasswordStrengthColor(score: number): string {
  if (score === 0) return 'bg-red-500';
  if (score === 1) return 'bg-red-400';
  if (score === 2) return 'bg-orange-400';
  if (score === 3) return 'bg-yellow-400';
  if (score === 4) return 'bg-green-400';
  return 'bg-green-500';
}
