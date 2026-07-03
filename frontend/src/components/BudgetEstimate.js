'use client';

const budgetRows = [
  ['Flights', 'flights'],
  ['Accommodation', 'accommodation'],
  ['Food', 'food'],
  ['Activities', 'activities'],
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function BudgetEstimate({ budget }) {
  if (!budget || !budget.total) {
    return (
      <div className="surface p-6 text-center text-sm text-slate-500 dark:text-slate-400">
        No budget estimate available.
      </div>
    );
  }

  return (
    <section className="surface p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">
            Cost guide
          </p>
          <h3 className="text-2xl font-bold text-slate-950 dark:text-white">Budget estimate</h3>
        </div>
        <div className="rounded-lg bg-slate-950 px-4 py-3 text-right text-white dark:bg-teal-400 dark:text-slate-950">
          <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Total</p>
          <p className="text-2xl font-bold">{formatCurrency(budget.total)}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {budgetRows.map(([label, key]) => {
          const amount = Number(budget[key] || 0);
          const percent = budget.total ? Math.min(100, Math.round((amount / budget.total) * 100)) : 0;

          return (
            <div key={key} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
                <span className="text-sm font-bold text-slate-950 dark:text-white">{formatCurrency(amount)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full rounded-full bg-teal-600 dark:bg-teal-300" style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
