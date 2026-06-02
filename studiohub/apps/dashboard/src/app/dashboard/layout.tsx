'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/Sidebar';
import ToastContainer from '@/components/Toast';
import type { Toast } from '@/types';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, user, loading, signOut } = useAuth();
  const router = useRouter();
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (!loading && !session) router.replace('/login');
  }, [session, loading, router]);

  const pushToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0e1a]">
        <div className="h-8 w-8 rounded-full border-2 border-white/10 border-t-[#3b82f6]" style={{ animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-[#0a0e1a]">
      <Sidebar userEmail={user?.email} onSignOut={handleSignOut} />

      {/* Main content — offset by sidebar width */}
      <main className="ml-[240px] flex-1 min-h-screen transition-[margin] duration-300">
        {/* Pass pushToast via a data attribute pattern — children access it through context or props */}
        <DashboardContext.Provider value={{ pushToast }}>
          {children}
        </DashboardContext.Provider>
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

// Simple context for toast notifications across dashboard pages
import { createContext, useContext } from 'react';

type DashboardContextType = {
  pushToast: (message: string, type?: Toast['type']) => void;
};

export const DashboardContext = createContext<DashboardContextType>({
  pushToast: () => {},
});

export function useDashboard() {
  return useContext(DashboardContext);
}
