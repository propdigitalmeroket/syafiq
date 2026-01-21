import { CalculatorInputs } from '../types';
import { Language } from '../translations';

const STORAGE_KEYS = {
  INPUTS: 'mortgageCalculator_inputs',
  LANGUAGE: 'mortgageCalculator_language',
} as const;

export interface SavedData {
  inputs: CalculatorInputs;
  language: Language;
}

export function saveToLocalStorage(inputs: CalculatorInputs, language: Language): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INPUTS, JSON.stringify(inputs));
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function loadFromLocalStorage(): SavedData | null {
  try {
    const inputsData = localStorage.getItem(STORAGE_KEYS.INPUTS);
    const languageData = localStorage.getItem(STORAGE_KEYS.LANGUAGE);

    if (inputsData) {
      const inputs = JSON.parse(inputsData) as CalculatorInputs;
      const language = (languageData as Language) || 'ms';
      return { inputs, language };
    }

    return null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.INPUTS);
    localStorage.removeItem(STORAGE_KEYS.LANGUAGE);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}
