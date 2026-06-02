'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && session) router.replace('/dashboard');
  }, [session, authLoading, router]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!supabase) {
      setError('Client not initialized');
      setLoading(false);
      return;
    }

    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      router.replace('/dashboard');
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Animated background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.08), transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.06), transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(59,130,246,0.04), transparent 50%)',
          animation: 'bgShift 20s ease-in-out infinite',
          backgroundSize: '200% 200%',
        }}
      />

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-xl font-bold text-white shadow-[0_0_40px_rgba(59,130,246,0.3)]">
            S
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">StudioHub</h1>
          <p className="mt-1 text-sm text-white/40">Sign in to your dashboard</p>
        </div>

        {/* Form card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-white/50 mb-1.5">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-medium text-white/50 mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400 animate-fade-in">
                {error}
              </div>
            )}

            <button
              id="btn-sign-in"
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#6366f1] py-3 text-sm font-semibold text-white transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white" style={{ animation: 'spin 0.6s linear infinite' }} />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
