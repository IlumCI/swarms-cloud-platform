import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SavedAgentConfig, AgentConfig } from '@/types/agent';

interface ConfigStore {
  // State
  savedConfigs: SavedAgentConfig[];

  // Actions
  saveConfig: (name: string, config: AgentConfig, tags?: string[]) => string;
  loadConfig: (id: string) => SavedAgentConfig | undefined;
  deleteConfig: (id: string) => void;
  updateConfig: (id: string, updates: Partial<SavedAgentConfig>) => void;
  getAllConfigs: () => SavedAgentConfig[];
  getConfigsByTag: (tag: string) => SavedAgentConfig[];
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      savedConfigs: [],

      saveConfig: (name, config, tags) => {
        const id = crypto.randomUUID();
        const newConfig: SavedAgentConfig = {
          id,
          name,
          config,
          tags,
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          savedConfigs: [...state.savedConfigs, newConfig],
        }));
        return id;
      },

      loadConfig: (id) => {
        return get().savedConfigs.find((c) => c.id === id);
      },

      deleteConfig: (id) => {
        set((state) => ({
          savedConfigs: state.savedConfigs.filter((c) => c.id !== id),
        }));
      },

      updateConfig: (id, updates) => {
        set((state) => ({
          savedConfigs: state.savedConfigs.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      getAllConfigs: () => get().savedConfigs,

      getConfigsByTag: (tag) => {
        return get().savedConfigs.filter((c) => c.tags?.includes(tag));
      },
    }),
    {
      name: 'config-store',
    }
  )
);
