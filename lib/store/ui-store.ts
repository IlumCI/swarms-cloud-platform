import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ViewMode, ToastNotification, Theme } from '@/types/ui';

interface UIStore {
  // State
  viewMode: ViewMode;
  sidebarOpen: boolean;
  toasts: ToastNotification[];
  theme: Theme;
  swarmsApiKey: string;

  // Actions
  setViewMode: (mode: ViewMode) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: Theme) => void;
  setSwarmsApiKey: (apiKey: string) => void;
  clearSwarmsApiKey: () => void;
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      viewMode: 'grid',
      sidebarOpen: false,
      toasts: [],
      theme: 'system',
      swarmsApiKey: '',

      setViewMode: (mode) => set({ viewMode: mode }),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setTheme: (theme) => {
        set({ theme });
      },

      setSwarmsApiKey: (apiKey) => {
        set({ swarmsApiKey: apiKey.trim() });
      },

      clearSwarmsApiKey: () => {
        set({ swarmsApiKey: '' });
      },

      addToast: (toast) => {
        const id = crypto.randomUUID();
        const newToast: ToastNotification = { ...toast, id };
        set((state) => ({ toasts: [...state.toasts, newToast] }));

        const duration = toast.duration || 5000;
        setTimeout(() => {
          get().removeToast(id);
        }, duration);
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      clearToasts: () => {
        set({ toasts: [] });
      },
    }),
    {
      name: 'ui-store',
      version: 3,
      partialize: (state) => ({
        viewMode: state.viewMode,
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
        swarmsApiKey: state.swarmsApiKey,
      }),
      // Coerce any unrecognised persisted theme value (from earlier app
      // versions) to 'dark' so the store always boots into a valid state.
      migrate: (persisted, version) => {
        const state = (persisted as { theme?: string } | null | undefined) ?? {};
        if (version < 3) {
          const t = state.theme;
          if (t !== 'light' && t !== 'dark' && t !== 'system') {
            state.theme = 'dark';
          }
        }
        return state as UIStore;
      },
    }
  )
);
