import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Transaction = {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "expense" | "income";
};

type TransactionsState = {
  items: Transaction[];
  filter: "all" | "expense" | "income";
};

const initialState: TransactionsState = {
  filter: "all",

  items: [
    {
      id: "1",
      date: "2019-11-21",
      description: "Subway",
      category: "Transport",
      amount: 30,
      type: "expense",
    },
    {
      id: "2",
      date: "2019-11-21",
      description: "Bananas",
      category: "Groceries",
      amount: 50,
      type: "expense",
    },
    {
      id: "3",
      date: "2019-11-20",
      description: "Coffee & Croissant",
      category: "Cafe & Restaurants",
      amount: 120,
      type: "expense",
    },
    {
      id: "4",
      date: "2019-11-20",
      description: "Uklon Taxi",
      category: "Transport",
      amount: 165,
      type: "expense",
    },
    {
      id: "5",
      date: "2019-11-19",
      description: "Dinner with colleagues",
      category: "Cafe & Restaurants",
      amount: 480,
      type: "expense",
    },
    {
      id: "6",
      date: "2019-11-18",
      description: "Silpo Supermarket",
      category: "Groceries",
      amount: 840,
      type: "expense",
    },
    {
      id: "7",
      date: "2019-11-17",
      description: "Freelance project",
      category: "Salary",
      amount: 4500,
      type: "income",
    },
  ],
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,

  reducers: {
    addTransaction: (
      state,
      action: PayloadAction<Transaction>
    ) => {
      state.items.unshift(action.payload);
    },

    removeTransaction: (
      state,
      action: PayloadAction<string>
    ) => {
      state.items = state.items.filter(
        (transaction) => transaction.id !== action.payload
      );
    },

    setFilter: (
      state,
      action: PayloadAction<TransactionsState["filter"]>
    ) => {
      state.filter = action.payload;
    },
  },
});

export const {
  addTransaction,
  removeTransaction,
  setFilter,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;