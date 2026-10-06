import type { RootState } from "./store";

// Отримання транзакцій відповідно до вибраного фільтра
export const selectFilteredTransactions = (state: RootState) =>
  state.transactions.items.filter(
    (transaction) =>
      state.transactions.filter === "all" ||
      transaction.type === state.transactions.filter
  );

// Загальна сума витрат
export const selectExpenseTotal = (state: RootState) =>
  state.transactions.items
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

// Загальна сума доходів
export const selectIncomeTotal = (state: RootState) =>
  state.transactions.items
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);