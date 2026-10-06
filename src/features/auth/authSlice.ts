// src/features/auth/authSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../utils/supabase';

interface AuthState {
  user: User | null;
  initializing: boolean;
  loading: boolean;
  error: string | null;
  info: string | null;
}

const initialState: AuthState = { user: null, initializing: true, loading: false, error: null, info: null };

const friendly = (msg: string): string => {
  if (msg.includes('Invalid login credentials'))
    return 'Невірний email або пароль. Якщо ви ще не реєструвалися, відкрийте вкладку Sign Up.';
  if (msg.includes('Email not confirmed'))
    return 'Підтвердіть email: ми надіслали вам лист з посиланням.';
  if (msg.includes('User already registered'))
    return 'Цей email уже зареєстрований. Увійдіть через вкладку Sign In.';
  if (msg.toLowerCase().includes('rate limit'))
    return 'Забагато спроб. Зачекайте кілька хвилин.';
  if (msg.includes('Password should be at least'))
    return 'Пароль має містити щонайменше 6 символів.';
  return msg;
};

export const signIn = createAsyncThunk<
  null,
  { email: string; password: string; remember: boolean },
  { rejectValue: string }
>('auth/signIn', async ({ email, password, remember }, { rejectWithValue }) => {
  localStorage.setItem('remember', remember ? '1' : '0');
  if (!remember) sessionStorage.setItem('session-only', '1');
  else sessionStorage.removeItem('session-only');

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return rejectWithValue(friendly(error.message));
  return null;
});

export const signUp = createAsyncThunk<
  string | null,
  { email: string; password: string },
  { rejectValue: string }
>('auth/signUp', async ({ email, password }, { rejectWithValue }) => {
  localStorage.setItem('remember', '1');
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return rejectWithValue(friendly(error.message));
  return data.session ? null : 'Перевірте пошту: ми надіслали лист для підтвердження.';
});

export const signInWithGoogle = createAsyncThunk<null, void, { rejectValue: string }>(
  'auth/google',
  async (_, { rejectWithValue }) => {
    localStorage.setItem('remember', '1');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) return rejectWithValue(friendly(error.message));
    return null;
  },
);

export const resetPassword = createAsyncThunk<string, string, { rejectValue: string }>(
  'auth/reset',
  async (email, { rejectWithValue }) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) return rejectWithValue(friendly(error.message));
    return 'Лист для відновлення пароля надіслано.';
  },
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  sessionStorage.removeItem('session-only');
  await supabase.auth.signOut();
  return null;
});

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (s, a: PayloadAction<User | null>) => {
      s.user = a.payload;
      s.initializing = false;
      if (a.payload) {
        s.error = null;
        s.info = null;
        s.loading = false;
      }
    },
    clearMessages: (s) => {
      s.error = null;
      s.info = null;
    },
  },
  extraReducers: (b) => {
    const is = (suffix: string) => (a: { type: string }) =>
      a.type.startsWith('auth/') && a.type.endsWith(suffix);

    b.addMatcher(is('/pending'), (s) => {
      s.loading = true;
      s.error = null;
      s.info = null;
    });
    b.addMatcher(is('/fulfilled'), (s, a: PayloadAction<unknown>) => {
      s.loading = false;
      s.info = typeof a.payload === 'string' ? a.payload : null;
    });
    b.addMatcher(is('/rejected'), (s, a: PayloadAction<unknown>) => {
      s.loading = false;
      s.error = typeof a.payload === 'string' ? a.payload : 'Щось пішло не так. Спробуйте ще раз.';
    });
  },
});

export const { setUser, clearMessages } = slice.actions;
export default slice.reducer;