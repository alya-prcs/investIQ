export type Category = 'Transport' | 'Groceries' | 'Cafe & Restaurants' | 'Other';
export type EntryType = 'expense' | 'income';

export interface Transaction {
  id: string;
  date: string; // ISO: 2019-11-21
  description: string;
  category: Category;
  amount: number;
  type: EntryType;
}