// src/features/analytics/data.ts
export interface CategoryRow {
  name: string;
  short: string;
  hint: string;
  spent: number;
  limit: number;
  change: number; // % vs попередній місяць
}

export const INFLOW = 45000;
export const MONTHLY_CAP = 43000;
export const DAYS_IN_MONTH = 30;

export const categories: CategoryRow[] = [
  { name: 'Groceries & Market', short: 'Groceries', hint: 'Essential food & supplies', spent: 5500, limit: 6000, change: 12.4 },
  { name: 'Entertainment & Dining', short: 'Leisure', hint: 'Restaurants, culture, games', spent: 4200, limit: 5000, change: -4.1 },
  { name: 'Gadgets & Hardware', short: 'Tech & Gear', hint: 'Electronics & peripherals', spent: 3200, limit: 3500, change: 34.8 },
  { name: 'Transport & Rides', short: 'Transport', hint: 'Fuel, taxi & transit passes', spent: 2100, limit: 3000, change: -8.2 },
  { name: 'Home & Utilities', short: 'Utilities', hint: 'Electricity, water, web', spent: 1600, limit: 2500, change: 0 },
  { name: 'Healthcare & Wellness', short: 'Health', hint: 'Pharmacy, clinics, gym', spent: 1200, limit: 2000, change: -10.4 },
  { name: 'Education & Subscriptions', short: 'Education', hint: 'Courses, cloud tools, books', spent: 800, limit: 1500, change: 0 },
];

export const OUTFLOW = categories.reduce((s, c) => s + c.spent, 0);
export const SURPLUS = INFLOW - OUTFLOW;
export const SAVINGS_RATE = (SURPLUS / INFLOW) * 100;
export const AUTO_SWEEP = 4500;

export const fmt = (n: number, digits = 2) =>
  n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });