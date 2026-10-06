import { useAppSelector } from "../../../redux/hooks";
import { selectFilteredTransactions } from "../../../redux/selectors";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function IntradayCard() {
  const last = useAppSelector(selectFilteredTransactions).slice(0, 3);

  return (
    <section className="card">
      <h3>
        Intraday Activity <small className="accent right">TODAY</small>
      </h3>
      <ul className="intraday">
        {last.map((t) => (
          <li key={t.id}>
            <span className={`ico ${t.type}`}>{t.type === "income" ? "↑" : "↓"}</span>
            <div>
              <b>{t.description}</b>
              <small className="muted">{t.category}</small>
            </div>
            <b className={t.type === "income" ? "accent" : ""}>
              {t.type === "income" ? "+" : "-"}
              {formatCurrency(t.amount)} ₴
            </b>
          </li>
        ))}
        {last.length === 0 && <li className="muted">No transactions yet.</li>}
      </ul>
    </section>
  );
}