
import { useState } from "react";
import NewTransactionForm from "./components/NewTransactionForm";
import ImpactCard from "./components/ImpactCard";
import AllocationCard from "./components/AllocationCard";
import IntradayCard from "./components/IntradayCard";
import type { FormMode } from "./formMode";
import "./transactions.css";

export default function TransactionsPage() {
  const [banner, setBanner] = useState(true);
  const [mode, setMode] = useState<FormMode>("expense");
  const [amount, setAmount] = useState("");

  return (
    <div className="tx-page">
      {banner && (
        <div className="engine">
          <span className="engine-ico" />

          <div>
            <small className="muted">
              INVESTIQ ENGINE <span className="accent">●</span> Telemetry Active
            </small>

            <p>
              Enter your transaction parameters below to update portfolio
              analytics and card ledgers in real time. Auto-reconciliation
              engaged.
            </p>
          </div>

          <button
            className="engine-close"
            aria-label="Close"
            onClick={() => setBanner(false)}
          >
            ✕
          </button>
        </div>
      )}

      <div className="tx-grid">
        <NewTransactionForm
          mode={mode}
          setMode={setMode}
          amount={amount}
          setAmount={setAmount}
        />

        <aside className="tx-side">
          <ImpactCard
            mode={mode}
            value={parseFloat(amount) || 0}
          />

          <AllocationCard />

          <IntradayCard />
        </aside>
      </div>
    </div>
  );
}

