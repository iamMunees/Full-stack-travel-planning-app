'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center" role="status" aria-label="Loading">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600 dark:border-slate-700 dark:border-t-teal-300" />
    </div>
  );
}
