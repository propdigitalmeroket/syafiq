import { createClient, User } from '@supabase/supabase-js';
import { SignUpData, SignInData } from '../types/auth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseBankProfile {
  id: number;
  bank_name: string;
  interest_rate_min: number;
  interest_rate_max: number;
  commitment_types: string[];
  min_income: number;
  max_dsr: number;
  special_features: string[];
  is_active: boolean;
  primary_focus: string[];
  secondary_focus: string[];
  notes: string;
}

export async function fetchBanksFromDatabase(): Promise<SupabaseBankProfile[]> {
  const { data, error } = await supabase
    .from('Recommended Banks')
    .select('*')
    .eq('is_active', true)
    .order('interest_rate_min', { ascending: true });

  if (error) {
    console.error('Error fetching banks:', error);
    return [];
  }

  return data || [];
}

export async function signUpWithEmail({ email, password, fullName }: SignUpData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signInWithEmail({ email, password }: SignInData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Sign in error:', {
      message: error.message,
      status: error.status,
      name: error.name,
    });
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    throw error;
  }
}

export async function resendConfirmationEmail(email: string) {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });

  if (error) {
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}
