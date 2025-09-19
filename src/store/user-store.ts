import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, HealthMetrics } from '@/types/wellness';

interface UserStore {
  user: UserProfile | null;
  isAuthenticated: boolean;
  healthMetrics: HealthMetrics[];
  setUser: (user: UserProfile) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  logout: () => void;
  addHealthMetric: (metric: HealthMetrics) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      healthMetrics: [],
      setUser: (user) => set({ user, isAuthenticated: true }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      logout: () => set({ user: null, isAuthenticated: false, healthMetrics: [] }),
      addHealthMetric: (metric) =>
        set((state) => ({
          healthMetrics: [...state.healthMetrics, metric],
        })),
    }),
    {
      name: 'wellness-user-storage',
    }
  )
);