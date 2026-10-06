// src/features/analytics/components/VarianceLedger.tsx
import { categories, OUTFLOW, fmt } from '../data';

export default function VarianceLedger() {
  return (
    <section className="an-card">
      <div className="row">
        <div>
          <h3>Category Variance Ledger</h3>
          <small className="muted">Granular breakdown against monthly limits and past historical cycle.</small>
        </div>
        <span className="an-tag">{categories.length} ACTIVE HEADS</span>
      </div>
      <div className="an-scroll">
        <table className="ledger">
          <thead>
            <tr><th>CATEGORY</th><th>AMOUNT SPENT</th><th>% SHARE</th><th>VS OCTOBER</th><th>BUDGET UTILIZATION</th></tr>
          </thead>
          <tbody>
            {categories.map((c) => {
              const util = (c.spent / c.limit) * 100;
              const up = c.change > 0;
              return (
                <tr key={c.name}>
                  <td><b>{c.name}</b><small className="muted">{c.hint}</small></td>
                  <td><b>{fmt(c.spent)} ₴</b></td>
                  <td>{((c.spent / OUTFLOW) * 100).toFixed(1)}%</td>
                  <td className={c.change === 0 ? 'muted' : up ? 'warn' : 'accent'}>
                    {up ? '↑' : c.change < 0 ? '↓' : ''} {c.change > 0 ? '+' : ''}{c.change.toFixed(1)}%
                  </td>
                  <td>
                    <small className="muted">{fmt(c.spent, 0)} / {fmt(c.limit, 0)} ₴</small>
                    <div className="bar"><i className={util > 85 ? 'hot' : ''} style={{ width: `${Math.min(100, util)}%` }} /></div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}