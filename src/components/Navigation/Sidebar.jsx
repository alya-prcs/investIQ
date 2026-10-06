// src/components/Navigation/Sidebar.tsx  (ЗАМІНИТИ)
export type Page = 'dashboard' | 'transactions';

const links: { label: string; page?: Page }[] = [
  { label: 'Home / Dashboard', page: 'dashboard' },
  { label: 'Transactions', page: 'transactions' },
  { label: 'Analytics & Reports' },
  { label: 'Vault / Savings' },
  { label: 'Settings' },
];

interface Props { page: Page; onNavigate: (p: Page) => void }

export default function Sidebar({ page, onNavigate }: Props) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-mark">↗</span>
        <div><b>InvestIQ</b><small>TERMINAL PRO</small></div>
      </div>
      <nav>
        {links.map((l) => (
          <a
            key={l.label}
            href="#"
            className={l.page === page ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); if (l.page) onNavigate(l.page); }}
          >
            {l.label}
          </a>
        ))}
      </nav>
      <div className="liquidity"><small>LIQUIDITY STATUS</small><b>+14.8% this month</b></div>
    </aside>
  );
}