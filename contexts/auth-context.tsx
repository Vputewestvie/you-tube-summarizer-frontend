'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  credits: number;
  refreshCredits: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);

  const fetchUserCredits = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('credits')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setCredits(data?.credits || 0);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const refreshCredits = async () => {
    if (user?.id) {
      await fetchUserCredits(user.id);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // State will be reset by the onAuthStateChange listener
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          credits: 0,
          created_at: session.user.created_at,
        });
        fetchUserCredits(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          credits: 0,
          created_at: session.user.created_at,
        });
        fetchUserCredits(session.user.id);
      } else {
        setUser(null);
        setCredits(0);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, credits, refreshCredits, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}