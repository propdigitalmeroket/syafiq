import { User } from '@supabase/supabase-js';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthUser extends User {
  fullName?: string;
}

export interface AuthError {
  message: string;
  code?: string;
}
