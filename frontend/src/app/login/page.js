'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/utils/api';
import { setToken } from '@/utils/auth';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData.email, formData.password);
      setToken(response.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 inline-flex items-center gap-3 text-lg font-bold text-slate-950 dark:text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500 text-sm font-black text-slate-950">
            TP
          </span>
          Trip Planner
        </Link>

        <section className="surface p-6 md:p-8">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">Welcome back</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Login</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Continue building your travel plans.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="field"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="field"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="primary-button w-full">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
            Do not have an account?{' '}
            <Link href="/register" className="font-bold text-teal-700 hover:underline dark:text-teal-300">
              Register
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
