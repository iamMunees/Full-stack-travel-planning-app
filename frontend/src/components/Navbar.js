'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { removeToken } from '@/utils/auth';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-white/20 bg-slate-950/90 text-white shadow-sm backdrop-blur dark:border-slate-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-lg font-bold tracking-tight transition hover:text-teal-200">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-400 text-sm font-black text-slate-950">
            TP
          </span>
          Trip Planner
        </Link>

        <button
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 md:hidden"
          title="Toggle menu"
          aria-label="Toggle menu"
        >
          <span className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
          </span>
        </button>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-white/10">
            Dashboard
          </Link>
          <ThemeToggle />
          <button onClick={handleLogout} className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-teal-100">
            Logout
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 px-4 py-4 md:hidden">
          <div className="space-y-3">
            <Link href="/dashboard" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10">
              Dashboard
            </Link>
            <div className="flex items-center justify-between rounded-lg px-3 py-2">
              <span className="text-sm font-semibold">Theme</span>
              <ThemeToggle />
            </div>
            <button onClick={handleLogout} className="w-full rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-950">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
