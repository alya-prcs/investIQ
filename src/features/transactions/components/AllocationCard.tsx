import { useAppSelector } from "../../../redux/hooks";
import { selectFilteredTransactions } from "../../../redux/selectors";
import { formatCurrency } from "../../../utils/formatCurrency";

const LIMIT = 8000;

export default function AllocationCard() {
  const items = useAppSelector(selectFilteredTransactions);
  const spent = items
    .filter((t) => t.type === "expense" && t.category === "Groceries")
    .reduce((s, t) => s + t.amount, 0);
  const pct = Math.min(100, (spent / LIMIT) * 100);
  const velocity = spent / Math.max(1, new Date().getDate());

  return (
    <section className="card">
      <h3>
        ◔ Monthly Allocation <small className="muted right">Nov 2019</small>
      </h3>
      <div className="row">
        <b>Groceries &amp; Supermarkets</b>
        <span>
          <b>{formatCurrency(spent)} ₴</b>{" "}
          <small className="muted">of {formatCurrency(LIMIT)} ₴</small>
        </span>
      </div>
      <div className="bar-track">
        <div style={{ width: `${pct}%` }} />
      </div>
      <div className="row small">
        <span className="accent">
          ● Cap safe: {formatCurrency(Math.max(0, LIMIT - spent))} ₴ buffer remaining
        </span>
        <span className="muted">{pct.toFixed(1)}% spent</span>
      </div>
      <div className="burn">
        <small className="muted">BURN VELOCITY</small>
        <b>{formatCurrency(velocity)} ₴ / day average</b>
        <svg viewBox="0 0 100 30" preserveAspectRatio="none">
          <path
            d="M0 26 C20 24 30 8 50 16 S80 6 100 2"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
          />
        </svg>
      </div>
    </section>
  );
}