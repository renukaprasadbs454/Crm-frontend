import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useClientAuthStore = create(
  persist(
    (set) => ({
      token: null,
      client: null,
      setClientAuth: (token, client) => set({ token, client }),
      clearClientAuth: () => set({ token: null, client: null }),
    }),
    { name: 'skill99-crm-client-auth' }
  )
);
