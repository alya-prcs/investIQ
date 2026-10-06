// src/features/analytics/components/InsightCard.tsx
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { SURPLUS, fmt } from '../data';

export default function InsightCard() {
  const [state, setState] = useState<'open' | 'saved' | 'dismissed'>('open');
  if (state === 'dismissed') return null;
  const sweep = SURPLUS * 0.1;

  return (
    <section className="an-card insight">
      <div className="row">
        <span className="an-ico"><Sparkles size={16} /></span>
        <small className="muted">InvestIQ Assistant <span className="accent">●</span></small>
      </div>
      <h3>Groceries increased by +12% MoM</h3>
      <p>
        Spending on groceries reached 5,500 ₴ (+12.4% vs October). Your discretionary reserve remains
        at {fmt(SURPLUS)} ₴. We recommend locking a 10% liquidity sweep ({fmt(sweep)} ₴) into your
        high-yield Vault to maximize November APY.
      </p>
      {state === 'saved' ? (
        <p className="accent">✓ {fmt(sweep)} ₴ marked for transfer to Vault.</p>
      ) : (
        <div className="row-gap">
          <button className="an-btn primary" onClick={() => setState('saved')}>Save 10% to Vault</button>
          <button className="an-btn" onClick={() => setState('dismissed')}>Dismiss</button>
        </div>
      )}
    </section>
  );
}