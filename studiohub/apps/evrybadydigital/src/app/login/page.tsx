'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (!supabase) { setMessage('Client not initialized'); return; }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else setMessage('Signed in');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase?.auth.signOut();
    setMessage('Signed out');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-alt text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-8">
        <h2 className="mb-4 text-2xl font-semibold">Sign in</h2>
        <form onSubmit={signIn} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="sr-only">Email</label>
            <input id="login-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3" />
          </div>
          <div>
            <label htmlFor="login-password" className="sr-only">Password</label>
            <input id="login-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3" />
          </div>
          <div className="flex items-center justify-between">
            <button disabled={loading} className="rounded-full bg-brand px-6 py-2 font-semibold text-surface">Sign in</button>
            <button type="button" onClick={signOut} className="text-sm text-white/70 underline">Sign out</button>
          </div>
        </form>
        {message ? <p className="mt-4 text-sm">{message}</p> : null}
      </div>
    </div>
  );
}
