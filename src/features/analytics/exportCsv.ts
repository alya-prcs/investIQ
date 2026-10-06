// src/features/analytics/exportCsv.ts
interface Row {
  date: string;
  description: string;
  category: string;
  amount: number;
  type: string;
}

const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

export function exportCsv(rows: Row[], filename = 'investiq-transactions.csv') {
  const head = ['Date', 'Description', 'Category', 'Type', 'Amount (UAH)'];
  const body = rows.map((r) => [r.date, r.description, r.category, r.type, r.amount].map(esc).join(','));
  const csv = '\uFEFF' + [head.map(esc).join(','), ...body].join('\n'); // BOM, щоб Excel читав кирилицю
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}