import { useAppSelector } from "../redux/hooks";

import {
  selectExpenseTotal,
  selectIncomeTotal,
} from "../redux/selectors";

export function useFinance() {
  const expenses = useAppSelector(selectExpenseTotal);
  const income = useAppSelector(selectIncomeTotal);

  const balance = 55000 + income - expenses;

  const spentPercent = Math.min(
    100,
    Math.round((expenses / 43000) * 100)
  );

  return {
    balance,
    expenses,
    income,
    spentPercent,
  };
}