import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section
        className="relative flex min-h-screen items-center overflow-hidden bg-cover bg-center px-4 py-12 sm:px-6 lg:px-8"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(2, 6, 23, 0.92) 0%, rgba(15, 23, 42, 0.78) 48%, rgba(15, 23, 42, 0.34) 100%), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1800&q=80')",
        }}
      >
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-teal-200">
              AI travel planning
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
              AI Trip Planner
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              Build polished itineraries, hotel ideas, and budget estimates from one focused planning workspace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="primary-button">
                Get started
              </Link>
              <Link href="/login" className="secondary-button border-white/30 bg-white/10 text-white hover:bg-white/20">
                Login
              </Link>
            </div>
          </div>

          <div className="surface hidden p-5 text-slate-950 dark:text-white lg:block">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">Preview</p>
                <h2 className="mt-1 text-xl font-bold">Lisbon in 4 days</h2>
              </div>
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 dark:bg-teal-400/10 dark:text-teal-200">
                Medium
              </span>
            </div>
            <div className="space-y-3">
              {['Alfama food walk', 'Tile museum and riverfront', 'Sintra day trip'].map((item, index) => (
                <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Day {index + 1}</p>
                  <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-950 to-transparent" />
      </section>
    </main>
  );
}
