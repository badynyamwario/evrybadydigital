'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (session) router.replace('/dashboard');
    else router.replace('/login');
  }, [session, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-white/10 border-t-[#3b82f6]" style={{ animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}
