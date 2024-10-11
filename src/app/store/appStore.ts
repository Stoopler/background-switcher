import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  twitchConnected: boolean
  obsConnected: boolean
  openAIConnected: boolean
  twitchAccessToken: string | null
  obsWebsocketUrl: string
  obsPort: string
  obsPassword: string
  openAIApiKey: string
  showSettings: boolean
  setTwitchConnected: (connected: boolean) => void
  setObsConnected: (connected: boolean) => void
  setOpenAIConnected: (connected: boolean) => void
  setTwitchAccessToken: (token: string | null) => void
  setObsWebsocketUrl: (url: string) => void
  setObsPort: (port: string) => void
  setObsPassword: (password: string) => void
  setOpenAIApiKey: (key: string) => void
  setShowSettings: (show: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      twitchConnected: false,
      obsConnected: false,
      openAIConnected: false,
      twitchAccessToken: null,
      obsWebsocketUrl: '',
      obsPort: '',
      obsPassword: '',
      openAIApiKey: '',
      showSettings: false,
      setTwitchConnected: (connected) => set({ twitchConnected: connected }),
      setObsConnected: (connected) => set({ obsConnected: connected }),
      setOpenAIConnected: (connected) => set({ openAIConnected: connected }),
      setTwitchAccessToken: (token) => set({ twitchAccessToken: token }),
      setObsWebsocketUrl: (url) => set({ obsWebsocketUrl: url }),
      setObsPort: (port) => set({ obsPort: port }),
      setObsPassword: (password) => set({ obsPassword: password }),
      setOpenAIApiKey: (key) => set({ openAIApiKey: key }),
      setShowSettings: (show) => set({ showSettings: show }),
    }),
    {
      name: 'background-changer-storage',
    }
  )
)