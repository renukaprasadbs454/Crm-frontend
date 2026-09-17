import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      accountType: 'staff',
      setAuth: (token, user, accountType = 'staff') => set({ token, user, accountType }),
      clearAuth: () => set({ token: null, user: null, accountType: 'staff' }),
    }),
    { name: 'skill99-crm-auth' }
  )
);
