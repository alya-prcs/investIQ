import {
  useAppDispatch,
  useAppSelector,
} from "../redux/hooks";

import {
  addTransaction,
  removeTransaction,
} from "../features/transactions/transactionsSlice";

import type { Transaction } from "../features/transactions/transactionsSlice";

export function useTransactions() {
  const items = useAppSelector(
    (state) => state.transactions.items
  );

  const dispatch = useAppDispatch();

  const add = (transaction: Transaction) => {
    dispatch(addTransaction(transaction));
  };

  const remove = (id: string) => {
    dispatch(removeTransaction(id));
  };

  return {
    items,
    add,
    remove,
  };
}