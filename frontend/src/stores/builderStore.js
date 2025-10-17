import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useBuilderStore = create(
  persist(
    (set) => ({
      config: {
        agent_name: '',
        template_id: null,
        schedule: '',
        features: [],
        gmail_email: '',
        openai_key: ''
      },
      
      setConfig: (config) => set({ config }),
      
      updateConfig: (updates) => set((state) => ({
        config: { ...state.config, ...updates }
      })),
      
      resetConfig: () => set({
        config: {
          agent_name: '',
          template_id: null,
          schedule: '',
          features: [],
          gmail_email: '',
          openai_key: ''
        }
      })
    }),
    {
      name: 'builder-storage',
      partialize: (state) => ({ config: state.config })
    }
  )
)