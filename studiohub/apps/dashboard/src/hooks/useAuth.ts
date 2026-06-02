'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    supabase?.auth.getSession().then(({ data }) => {
      if (!mountedRef.current) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } =
      supabase?.auth.onAuthStateChange((_event, s) => {
        if (!mountedRef.current) return;
        setSession(s ?? null);
        setUser(s?.user ?? null);
        setLoading(false);
      }) ?? { data: null };

    return () => {
      mountedRef.current = false;
      sub?.subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
    setSession(null);
    setUser(null);
  }, []);

  return { session, user, loading, signOut };
}
