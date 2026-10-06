// src/features/analytics/AnalyticsPage.tsx
import { useState } from 'react';
import { Filter, Download } from 'lucide-react';
import { useAppSelector } from '../../redux/hooks';
import { selectFilteredTransactions } from '../../redux/selectors';
import { exportCsv } from './exportCsv';
import KpiCards from './components/KpiCards';
// import SpendingChart from './components/SpendingChart';
import InsightCard from './components/InsightCard';
import VarianceLedger from './components/VarianceLedger';
// import InflowDonut from './components/InflowDonut';
// import ReportingHub from './components/ReportingHub';
import './analytics.css';

const periods = ['Month', 'Quarter', 'Year', 'Custom'] as const;

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<(typeof periods)[number]>('Month');
  const transactions = useAppSelector(selectFilteredTransactions);
  const onCsv = () => exportCsv(transactions);

  return (
    <div className="an-page">
      <div className="an-head">
        <div>
          <h1>Analytics &amp; Reports</h1>
          <p className="muted">Deep portfolio cash flow breakdown, spending trends &amp; predictive models</p>
        </div>
        <div className="an-controls">
          <span className="an-month">November 2019</span>
          <div className="an-seg">
            {periods.map((p) => (
              <button key={p} className={p === period ? 'on' : ''} onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
          <button className="an-btn"><Filter size={14} /> Filter (7)</button>
          <button className="an-btn primary" onClick={onCsv}><Download size={14} /> Export CSV / PDF</button>
        </div>
      </div>

      <KpiCards />

      <div className="an-grid">
        <div className="an-col">
          {/* <SpendingChart /> */}
          <VarianceLedger />
        </div>
        <div className="an-col">
          <InsightCard />
          {/* <InflowDonut />
          <ReportingHub onCsv={onCsv} onPdf={() => window.print()} /> */}
        </div>
      </div>
    </div>
  );
}