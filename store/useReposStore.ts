import { create } from "zustand";
import { reposApi } from "@/lib/api-client";

export interface Repo {
  _id: string;
  name: string;
  fullName: string;
  owner: string;
  defaultBranch: string;
  isActive: boolean;
  settings: {
    autoUpdate: boolean;
    docTypes: {
      readme: boolean;
      changelog: boolean;
      apiDocs: boolean;
      architectureDocs: boolean;
    };
    branchPreference: string;
    emailNotifications: boolean;
  };
  lastProcessedCommit?: string;
  lastProcessedAt?: string;
  language?: string;
  size?: number;
}

interface ReposState {
  repos: Repo[];
  availableRepos: any[];
  loading: boolean;
  error: string | null;
  fetchRepos: () => Promise<void>;
  fetchAvailable: () => Promise<void>;
  connectRepo: (repoId: number, owner: string, name: string) => Promise<void>;
  disconnectRepo: (repoId: string) => Promise<void>;
  updateSettings: (repoId: string, settings: any) => Promise<void>;
}

export const useReposStore = create<ReposState>((set, get) => ({
  repos: [],
  availableRepos: [],
  loading: false,
  error: null,
  fetchRepos: async () => {
    set({ loading: true, error: null });
    try {
      const data = await reposApi.getConnected();
      set({ repos: data.repos || [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  fetchAvailable: async () => {
    set({ loading: true, error: null });
    try {
      const data = await reposApi.list();
      set({ availableRepos: data.repos || [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  connectRepo: async (repoId, owner, name) => {
    try {
      const data = await reposApi.connect({ repoId, owner, name });
      set((state) => ({
        repos: [...state.repos, data.repo],
      }));
    } catch (error: any) {
      throw error;
    }
  },
  disconnectRepo: async (repoId) => {
    try {
      await reposApi.disconnect(repoId);
      set((state) => ({
        repos: state.repos.filter((r) => r._id !== repoId),
      }));
    } catch (error: any) {
      throw error;
    }
  },
  updateSettings: async (repoId, settings) => {
    try {
      const data = await reposApi.updateSettings(repoId, settings);
      set((state) => ({
        repos: state.repos.map((r) =>
          r._id === repoId ? { ...r, ...data.repo } : r
        ),
      }));
    } catch (error: any) {
      throw error;
    }
  },
}));

