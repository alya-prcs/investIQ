import { useRef, useState, KeyboardEvent, DragEvent } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import { addTransaction } from "../transactionsSlice";
import type { FormMode } from "../formMode";

const categories = [
  "Transport",
  "Groceries",
  "Cafe & Restaurants",
  "Housing",
  "Health",
  "Shopping",
  "Salary",
  "Other",
];
const quick = [100, 500, 1000, 5000, 10000];
const modes: { key: FormMode; label: string; icon: string }[] = [
  { key: "expense", label: "Expense", icon: "↓" },
  { key: "income", label: "Income", icon: "↑" },
  { key: "transfer", label: "Transfer", icon: "⇄" },
];
const nowLocal = () =>
  new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

interface Props {
  mode: FormMode;
  setMode: (m: FormMode) => void;
  amount: string;
  setAmount: (v: string) => void;
}

export default function NewTransactionForm({ mode, setMode, amount, setAmount }: Props) {
  const dispatch = useAppDispatch();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dateTime, setDateTime] = useState(nowLocal());
  const [category, setCategory] = useState("Groceries");
  const [narrative, setNarrative] = useState("");
  const [tags, setTags] = useState<string[]>(["Weekly Provisions", "Supermarket"]);
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [recurring, setRecurring] = useState(false);

  const addQuick = (n: number) => setAmount(String((parseFloat(amount) || 0) + n));

  const addTag = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.size <= 25 * 1024 * 1024) setFile(f);
  };

  const reset = () => {
    setAmount("");
    setNarrative("");
    setTags([]);
    setFile(null);
    setRecurring(false);
    setDateTime(nowLocal());
  };

  const submit = () => {
    const value = parseFloat(amount);
    if (!(value > 0) || !narrative.trim()) return;
    dispatch(
      addTransaction({
        id: crypto.randomUUID(),
        date: dateTime.slice(0, 10),
        description: narrative.trim(),
        category: mode === "transfer" ? "Other" : category,
        amount: value,
        type: mode === "income" ? "income" : "expense",
      })
    );
    reset();
  };

  return (
    <section className="card tx-form">
      <div className="mode-row">
        <div className="mode-tabs">
          {modes.map((m) => (
            <button
              key={m.key}
              type="button"
              className={mode === m.key ? "on" : ""}
              onClick={() => setMode(m.key)}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>
        <small className="muted">
          <span className="accent">◎</span> Ledger Node #8204-UA
        </small>
      </div>

      <div className="amount-box">
        <small className="muted">GROSS TRANSACTION VALUE</small>
        <div className="amount-row">
          <span className="cur">₴</span>
          <input
            className="amount-input"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <span className="pill">UAH ●</span>
        </div>
        <div className="quick-row">
          {quick.map((n) => (
            <button key={n} type="button" className="pill" onClick={() => addQuick(n)}>
              +{n.toLocaleString("en-US")}
            </button>
          ))}
        </div>
      </div>

      <div className="form-grid">
        <label>
          <small className="muted">Execution Date & Timestamp</small>
          <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
        </label>
        <label>
          <small className="muted">Origin Source Account</small>
          <div className="field account">
            <span className="card-ico">▭</span>
            <div>
              <b>Main Black Card</b>
              <small className="muted">Avail: 48,290.00 ₴</small>
            </div>
          </div>
        </label>
        <label>
          <small className="muted">Expense Classification</small>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={mode === "transfer"}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          <small className="muted">Narrative / Counterparty Details</small>
          <input
            placeholder="Grocery shopping at Silpo"
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
          />
        </label>
        <div>
          <small className="muted">Portfolio Tags & Subcategory</small>
          <div className="field tags">
            {tags.map((t) => (
              <span key={t} className="tag">
                {t}{" "}
                <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}>
                  ×
                </button>
              </span>
            ))}
            <input
              placeholder="+ Add tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
            />
          </div>
        </div>
        <div>
          <small className="muted">Fiscal Attachment / Proof Voucher</small>
          <div className="dropzone" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
            <span>☁</span>
            {file ? (
              <b>{file.name}</b>
            ) : (
              <b>
                Drop voucher file or{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); fileRef.current?.click(); }}>
                  browse
                </a>
              </b>
            )}
            <small className="muted">Supports PDF, PNG, JPG (Encrypted up to 25MB)</small>
            <input
              ref={fileRef}
              type="file"
              hidden
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>
      </div>

      <div className="form-footer">
        <label className="check">
          <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />
          Save as recurring scheduled transaction
        </label>
        <button type="button" className="btn-ghost" onClick={reset}>
          Clear Form
        </button>
        <button type="button" className="btn-primary" onClick={submit}>
          ✓ Submit Transaction
        </button>
      </div>
    </section>
  );
}