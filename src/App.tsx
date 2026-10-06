// src/App.tsx
import { useState } from "react";

import {
  LayoutDashboard,
  ArrowLeftRight,
  ChartNoAxesCombined,
  Wallet,
  SlidersHorizontal,
  Search,
  Bell,
  UserRound,
  Landmark,
  PlusCircle,
  CalendarDays,
  Trash2,
  ChevronDown,
  ArrowDown,
  ArrowUp,
  Menu,
  X,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "./redux/hooks";

import {
  addTransaction,
  removeTransaction,
} from "./features/transactions/transactionsSlice";

import { selectFilteredTransactions } from "./redux/selectors";

import { formatCurrency } from "./utils/formatCurrency";
import { formatDate } from "./utils/formatDate";
import { useFinance } from "./hooks/useFinance";

import TransactionsPage from "./features/transactions/TransactionsPage";
import AnalyticsPage from "./features/analytics/AnalyticsPage";
import "./App.css";

const navigation = [
  { label: "Home / Dashboard", icon: LayoutDashboard },
  { label: "Transactions", icon: ArrowLeftRight },
  { label: "Analytics & Reports", icon: ChartNoAxesCombined },
  { label: "Vault / Savings", icon: Wallet },
  { label: "Settings", icon: SlidersHorizontal },
];

const months = [
  { month: "NOVEMBER", value: 18000 },
  { month: "OCTOBER", value: 28000 },
  { month: "SEPTEMBER", value: 26000 },
  { month: "AUGUST", value: 22500 },
  { month: "JULY", value: 31200 },
  { month: "JUNE", value: 24100 },
];

export default function App() {
  const dispatch = useAppDispatch();

  const transactions = useAppSelector(selectFilteredTransactions);

  const filter = useAppSelector((state) => state.transactions.filter);

  const { balance, expenses, income, spentPercent } = useFinance();

  const [activeNav, setActiveNav] = useState("Home / Dashboard");

  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [date, setDate] = useState("2019-11-21");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Transport");
  const [amount, setAmount] = useState("");

  const [kind, setKind] = useState<"expense" | "income">("expense");

  const [notice, setNotice] = useState("");

  const shown = transactions.filter((transaction) =>
    `${transaction.description} ${transaction.category}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  function submitTransaction() {
    const value = Number(amount);

    if (!description.trim() || !Number.isFinite(value) || value <= 0) {
      setNotice("Вкажи опис і суму більше нуля.");
      return;
    }

    dispatch(
      addTransaction({
        id: crypto.randomUUID(),
        date,
        description: description.trim(),
        category,
        amount: value,
        type: kind,
      })
    );

    setDescription("");
    setAmount("");
    setNotice("Транзакцію додано.");

    window.setTimeout(() => setNotice(""), 2500);
  }

  return (
    <div className="app-shell">
      {/* SIDEBAR */}

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <ChartNoAxesCombined size={19} />
          </div>

          <div>
            <b>
              Invest<span>IQ</span>
            </b>
            <small>TERMINAL PRO</small>
          </div>

          <button className="close-menu" onClick={() => setMobileOpen(false)}>
            <X />
          </button>
        </div>

        <nav>
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={activeNav === label ? "nav-item active" : "nav-item"}
              onClick={() => {
                setActiveNav(label);
                setMobileOpen(false);
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="liquidity">
          <small>LIQUIDITY STATUS</small>
          <strong>+14.8% this month</strong>
          <i />
        </div>
      </aside>

      {mobileOpen && (
        <button
          className="scrim"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      )}

      <main className="main-area">
        {/* HEADER */}

        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)}>
            <Menu />
          </button>

          <div className="searchbox">
            <Search size={15} />

            <input
              placeholder="Search transactions, assets, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="top-actions">
            <div className="mini-balance">
              <Landmark size={16} />

              <span>
                Balance
                <br />
                <b>{formatCurrency(balance)}</b>
              </span>
            </div>

            <button className="icon-btn">
              <Bell size={17} />
              <i />
            </button>

            <div className="profile">
              <div>
                <b>Alexander V.</b>
                <small>Private Investor</small>
              </div>

              <span>
                <UserRound size={16} />
              </span>
            </div>
          </div>
        </header>

        {/* PAGE SWITCH */}

        {activeNav === "Transactions" ? (
  <TransactionsPage />
) : activeNav === "Analytics & Reports" ? (
  <AnalyticsPage />
) : (
  <>
    {/* ...дашборд без змін... */}

            <section className="balance-strip">
              <div className="balance-label">
                <Wallet size={16} />

                <span>BALANCE:</span>

                <strong>{formatCurrency(balance)}</strong>
              </div>

              <button className="confirm">
                CONFIRM <span>●</span>
              </button>

              <div className="toggle-group">
                <button
                  className={kind === "expense" ? "selected" : ""}
                  onClick={() => setKind("expense")}
                >
                  <ArrowDown size={14} />
                  EXPENSES
                </button>

                <button
                  className={kind === "income" ? "selected" : ""}
                  onClick={() => setKind("income")}
                >
                  <ArrowUp size={14} />
                  INCOME
                </button>
              </div>
            </section>

            {/* DASHBOARD GRID */}

            <div className="dashboard-grid">
              <div className="left-column">
                {/* QUICK TRANSACTION */}

                <section className="panel quick-panel">
                  <div className="panel-heading">
                    <h2>
                      <PlusCircle />
                      Quick Transaction Entry
                    </h2>

                    <small>TERMINAL V2.4</small>
                  </div>

                  <div className="entry-fields">
                    <label className="field date-field">
                      <CalendarDays size={14} />

                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </label>

                    <input
                      className="field"
                      placeholder="Item / service description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />

                    <label className="field select-field">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        {[
                          "Transport",
                          "Groceries",
                          "Cafe & Restaurants",
                          "Housing",
                          "Health",
                          "Shopping",
                          "Salary",
                          "Other",
                        ].map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>

                      <ChevronDown size={13} />
                    </label>

                    <label className="field amount-field">
                      <input
                        type="number"
                        min="0"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />

                      <span>₴</span>
                    </label>
                  </div>

                  <div className="entry-footer">
                    <span className="notice">{notice}</span>

                    <button
                      className="clear-btn"
                      onClick={() => {
                        setDescription("");
                        setAmount("");
                        setNotice("");
                      }}
                    >
                      Clear
                    </button>

                    <button className="enter-btn" onClick={submitTransaction}>
                      Enter <ArrowUp size={14} />
                    </button>
                  </div>
                </section>

                {/* TRANSACTIONS TABLE */}

                <section className="panel registry-panel">
                  <div className="panel-heading">
                    <h2>
                      <Wallet />
                      Financial Operations Registry
                    </h2>

                    <small>
                      TOTAL RECORDS: <b>{shown.length}</b>
                    </small>
                  </div>

                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>DATE</th>
                          <th>DESCRIPTION</th>
                          <th>CATEGORY</th>
                          <th>AMOUNT</th>
                          <th>ACTIONS</th>
                        </tr>
                      </thead>

                      <tbody>
                        {shown.map((transaction) => (
                          <tr key={transaction.id}>
                            <td>{formatDate(transaction.date)}</td>

                            <td>
                              <span className={`dot ${transaction.type}`} />

                              {transaction.description}
                            </td>

                            <td>
                              <span className="category-pill">
                                {transaction.category}
                              </span>
                            </td>

                            <td
                              className={
                                transaction.type === "expense"
                                  ? "negative"
                                  : "positive"
                              }
                            >
                              {transaction.type === "expense" ? "-" : "+"}

                              {formatCurrency(transaction.amount)}
                            </td>

                            <td>
                              <button
                                className="delete-btn"
                                onClick={() =>
                                  dispatch(removeTransaction(transaction.id))
                                }
                                aria-label="Delete transaction"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}

                        {shown.length === 0 && (
                          <tr>
                            <td colSpan={5} className="empty">
                              No transactions found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN */}

              <aside className="right-column">
                {/* SUMMARY */}

                <section className="panel summary-panel">
                  <div className="panel-heading">
                    <h2>
                      <ChartNoAxesCombined />
                      SUMMARY
                    </h2>

                    <CalendarDays size={14} />
                  </div>

                  <div className="month-list">
                    {months.map((item) => (
                      <div className="month-row" key={item.month}>
                        <b>{item.month}</b>

                        <strong>{formatCurrency(item.value)}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="chart-caption">
                    DISTRIBUTION DYNAMICS
                    <span>-35.7% vs October</span>
                  </div>

                  <div className="bar-chart">
                    {[
                      ["Jun", 65],
                      ["Jul", 72],
                      ["Aug", 60],
                      ["Sep", 77],
                      ["Oct", 73],
                      ["Nov", 48],
                    ].map(([month, height]) => (
                      <div className="bar-col" key={month}>
                        <div className="bar" style={{ height: `${height}%` }} />

                        <small>{month}</small>
                      </div>
                    ))}
                  </div>
                </section>

                {/* BUDGET LIMIT */}

                <section className="panel limit-panel">
                  <div className="limit-title">
                    <small>LIMIT FOR NOVEMBER</small>

                    <strong>{100 - spentPercent}% available</strong>
                  </div>

                  <div className="progress">
                    <span style={{ width: `${spentPercent}%` }} />
                  </div>

                  <div className="limit-meta">
                    <span>Spent: {formatCurrency(expenses)}</span>

                    <span>Plan: {formatCurrency(43000)}</span>
                  </div>
                </section>

                {/* EXTRA STATISTICS */}

                <section className="panel mini-stats">
                  <span>INCOME THIS PERIOD</span>

                  <b className="positive">{formatCurrency(income)}</b>

                  <span>EXPENSES THIS PERIOD</span>

                  <b className="negative">{formatCurrency(expenses)}</b>
                </section>
              </aside>
            </div>
          </>
        )}

        <footer>
          INVESTIQ TERMINAL PRO
          <span>SECURE FINANCE WORKSPACE · 2026</span>
        </footer>
      </main>
    </div>
  );
}