import { useFinance } from "../../../hooks/useFinance";
import { formatCurrency } from "../../../utils/formatCurrency";
import type { FormMode } from "../formMode";

export default function ImpactCard({ mode, value }: { mode: FormMode; value: number }) {
  const { balance } = useFinance();
  const delta = mode === "income" ? value : -value;
  const projected = balance + delta;
  const preserved =
    balance > 0 ? Math.max(0, Math.min(100, (projected / balance) * 100)) : 0;

  return (
    <section className="card">
      <div className="row">
        <small className="muted">ASSET IMPACT MODEL</small>
        <span className="live-chip" />
      </div>
      <div className="impact">
        <div className="row">
          <span>Current Balance</span>
          <b>{formatCurrency(balance)} ₴</b>
        </div>
        <div className="row">
          <span>{mode === "income" ? "Addition" : "Deduction"}</span>
          <b className={delta < 0 ? "neg" : "accent"}>
            {delta < 0 ? "-" : "+"}
            {formatCurrency(Math.abs(delta))} ₴
          </b>
        </div>
        <div className="row">
          <span>Projected Balance</span>
          <b className="accent big">{formatCurrency(projected)} ₴</b>
        </div>
      </div>
      <div className="row small">
        <span className="muted">Liquidity Preserved</span>
        <span className="accent">{preserved.toFixed(1)}%</span>
      </div>
      <div className="bar-track">
        <div style={{ width: `${preserved}%` }} />
      </div>
    </section>
  );
}