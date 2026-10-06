import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../services/supabaseClient';

export interface UserProfile {
  id: string;
  email: string | null;
  balance: number;
  currency: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Отримання поточного профілю (включно з балансом)
export const fetchUserProfile = createAsyncThunk<
  UserProfile,
  string,
  { rejectValue: string }
>('auth/fetchProfile', async (userId, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as UserProfile;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Не вдалося завантажити профіль');
  }
});

// Оновлення балансу вручну
export const updateBalance = createAsyncThunk<
  number,
  { userId: string; newBalance: number },
  { rejectValue: string }
>('auth/updateBalance', async ({ userId, newBalance }, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return (data as UserProfile).balance;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Не вдалося оновити баланс');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.profile = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.profile = action.payload;
      })
      .addCase(updateBalance.fulfilled, (state, action: PayloadAction<number>) => {
        if (state.profile) {
          state.profile.balance = action.payload;
        }
      });
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;