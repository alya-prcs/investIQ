// src/features/analytics/components/KpiCards.tsx
import { INFLOW, OUTFLOW, SURPLUS, SAVINGS_RATE, AUTO_SWEEP, MONTHLY_CAP, DAYS_IN_MONTH, fmt } from '../data';

export default function KpiCards() {
  const velocity = OUTFLOW / DAYS_IN_MONTH;
  const utilization = (OUTFLOW / MONTHLY_CAP) * 100;
  const outflowPct = (OUTFLOW / INFLOW) * 100;

  return (
    <div className="an-kpis">
      <section className="an-card">
        <div className="row"><small className="muted">NET PERIOD BALANCE</small><span className="an-chip" /></div>
        <div className="kpi">{fmt(INFLOW)} <small>₴</small></div>
        <small className="muted">Total recognized inflow across all 3 asset sources</small>
        <div className="row small">
          <span className="neg">Outflow: -{fmt(OUTFLOW)} ₴</span>
          <span className="accent">Surplus: +{fmt(SURPLUS)} ₴</span>
        </div>
        <div className="split"><i style={{ width: `${outflowPct}%` }} /></div>
      </section>

      <section className="an-card">
        <div className="row"><small className="muted">BUDGET BURN VELOCITY</small><span className="an-tag">Under Budget</span></div>
        <div className="kpi">{Math.round(velocity)} <small>₴ / day</small></div>
        <small className="muted">Projected month-end: -{fmt(OUTFLOW)} ₴ vs hard cap</small>
        <div className="row small"><span className="muted">Monthly cap utilization</span><span className="accent">{utilization.toFixed(1)}% (Safe Margin)</span></div>
        <div className="bar"><i style={{ width: `${utilization}%` }} /></div>
      </section>

      <section className="an-card">
        <div className="row"><small className="muted">SAVINGS &amp; LIQUIDITY RATIO</small><span className="an-tag">Optimal</span></div>
        <div className="kpi accent">{SAVINGS_RATE.toFixed(1)}% <small>net rate</small></div>
        <small className="muted">Auto-vault sweep missed +{fmt(AUTO_SWEEP)} ₴ this cycle</small>
        <div className="row small"><span className="muted">{SAVINGS_RATE.toFixed(1)}% saved</span><span className="muted">Target: 55.0%</span></div>
        <div className="bar"><i style={{ width: `${SAVINGS_RATE}%` }} /></div>
      </section>
    </div>
  );
}