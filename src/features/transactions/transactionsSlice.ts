// src/features/transactions/transactionsSlice.ts  (ЗАМІНИТИ)
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from "@reduxjs/toolkit";
import { supabase } from '../../utils/supabase';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'expense' | 'income';
}

interface State {
  items: Transaction[];
  filter: string; // залиште тут свій тип, якщо він інший
  loading: boolean;
  error: string | null;
}

const initialState: State = { items: [], filter: 'all', loading: false, error: null };

const toTx = (r: any): Transaction => ({
  id: r.id,
  date: r.date,
  description: r.description,
  category: r.category,
  amount: Number(r.amount),
  type: r.type,
});

export const fetchTransactions = createAsyncThunk<Transaction[], void, { rejectValue: string }>(
  'transactions/fetch',
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) return rejectWithValue(error.message);
    return (data ?? []).map(toTx);
  },
);

// Назви збігаються з попередніми екшенами, тому компоненти змінювати не треба
export const addTransaction = createAsyncThunk<Transaction, Transaction, { rejectValue: string }>(
  'transactions/add',
  async (tx, { rejectWithValue }) => {
    const { data, error } = await supabase.from('transactions').insert(tx).select().single();
    if (error) return rejectWithValue(error.message);
    return toTx(data);
  },
);

export const removeTransaction = createAsyncThunk<string, string, { rejectValue: string }>(
  'transactions/remove',
  async (id, { rejectWithValue }) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) return rejectWithValue(error.message);
    return id;
  },
);

const slice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransactions: (s) => { s.items = []; },
    setFilter: (s, a: PayloadAction<string>) => { s.filter = a.payload; },
  },
  extraReducers: (b) => {
    b.addCase(fetchTransactions.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(fetchTransactions.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; });
    b.addCase(fetchTransactions.rejected, (s, a) => { s.loading = false; s.error = a.payload ?? 'Не вдалося завантажити транзакції'; });
    b.addCase(addTransaction.fulfilled, (s, a) => { s.items.unshift(a.payload); });
    b.addCase(addTransaction.rejected, (s, a) => { s.error = a.payload ?? 'Не вдалося додати транзакцію'; });
    b.addCase(removeTransaction.fulfilled, (s, a) => { s.items = s.items.filter((t) => t.id !== a.payload); });
    b.addCase(removeTransaction.rejected, (s, a) => { s.error = a.payload ?? 'Не вдалося видалити транзакцію'; });
  },
});

export const { clearTransactions, setFilter } = slice.actions;
export default slice.reducer;