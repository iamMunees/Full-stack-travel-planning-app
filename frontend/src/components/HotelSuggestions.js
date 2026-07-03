'use client';

export default function HotelSuggestions({ hotels }) {
  if (!hotels || hotels.length === 0) {
    return (
      <div className="surface p-6 text-center text-sm text-slate-500 dark:text-slate-400">
        No hotel suggestions available.
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">
          Stay options
        </p>
        <h3 className="text-2xl font-bold text-slate-950 dark:text-white">Recommended hotels</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {hotels.map((hotel, index) => (
          <article key={`${hotel.name}-${index}`} className="surface p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              H{index + 1}
            </div>
            <p className="mb-2 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
              {hotel.category}
            </p>
            <h4 className="mb-2 text-lg font-bold text-slate-950 dark:text-white">{hotel.name}</h4>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{hotel.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
