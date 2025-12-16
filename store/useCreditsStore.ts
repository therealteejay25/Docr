import { create } from "zustand";
import { creditsApi } from "@/lib/api-client";

interface CreditsState {
  balance: number;
  isBelowThreshold: boolean;
  loading: boolean;
  fetchBalance: () => Promise<void>;
  addCredits: (amount: number) => Promise<void>;
}

export const useCreditsStore = create<CreditsState>((set) => ({
  balance: 0,
  isBelowThreshold: false,
  loading: false,
  fetchBalance: async () => {
    set({ loading: true });
    try {
      const data = await creditsApi.getBalance();
      set({
        balance: data.balance,
        isBelowThreshold: data.isBelowThreshold,
        loading: false,
      });
    } catch (error: any) {
      set({ loading: false });
    }
  },
  addCredits: async (amount) => {
    try {
      await creditsApi.add(amount);
      await useCreditsStore.getState().fetchBalance();
    } catch (error: any) {
      throw error;
    }
  },
}));

