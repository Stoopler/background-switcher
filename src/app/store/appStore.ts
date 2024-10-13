import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface RewardInfo {
  id: string
  broadcaster_id: string
  title: string
  cost: number
  prompt: string
  is_enabled: boolean
}

interface LogEntry {
  message: string
  timestamp: string
  details?: string
}

interface AppState {
  twitchConnected: boolean
  obsConnected: boolean
  openAIConnected: boolean
  twitchAccessToken: string | null
  obsWebsocketUrl: string
  obsPort: string
  obsPassword: string
  openAIApiKey: string
  openAIOrganizationId: string
  showSettings: boolean
  setTwitchConnected: (connected: boolean) => void
  setObsConnected: (connected: boolean) => void
  setOpenAIConnected: (connected: boolean) => void
  setTwitchAccessToken: (token: string | null) => void
  setObsWebsocketUrl: (url: string) => void
  setObsPort: (port: string) => void
  setObsPassword: (password: string) => void
  setOpenAIApiKey: (key: string) => void
  setOpenAIOrganizationId: (id: string) => void
  setShowSettings: (show: boolean) => void
  channelPointReward: RewardInfo | null
  setChannelPointReward: (reward: RewardInfo | null) => void
  obsSourceType: 'image' | 'browser'
  obsSelectedSource: string
  obsBrowserSourceUrl: string
  setObsSourceType: (type: 'image' | 'browser') => void
  setObsSelectedSource: (source: string) => void
  setObsBrowserSourceUrl: (url: string) => void
  refreshBrowserSourceUrl: () => void
  generateBrowserSourceUrl: () => void
  debugLog: LogEntry[]
  addLogEntry: (message: string, details?: string) => void
  broadcasterId: string | null
  setBroadcasterId: (id: string | null) => void
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
      openAIOrganizationId: '',
      showSettings: false,
      setTwitchConnected: (connected) => set({ twitchConnected: connected }),
      setObsConnected: (connected) => set({ obsConnected: connected }),
      setOpenAIConnected: (connected) => set({ openAIConnected: connected }),
      setTwitchAccessToken: (token) => set({ twitchAccessToken: token }),
      setObsWebsocketUrl: (url) => set({ obsWebsocketUrl: url }),
      setObsPort: (port) => set({ obsPort: port }),
      setObsPassword: (password) => set({ obsPassword: password }),
      setOpenAIApiKey: (key) => set({ openAIApiKey: key }),
      setOpenAIOrganizationId: (id) => set({ openAIOrganizationId: id }),
      setShowSettings: (show) => set({ showSettings: show }),
      channelPointReward: null,
      setChannelPointReward: (reward) => set({ channelPointReward: reward }),
      obsSourceType: 'image',
      obsSelectedSource: '',
      obsBrowserSourceUrl: '',
      setObsSourceType: (type) => set({ obsSourceType: type }),
      setObsSelectedSource: (source) => set({ obsSelectedSource: source }),
      setObsBrowserSourceUrl: (url) => set({ obsBrowserSourceUrl: url }),
      refreshBrowserSourceUrl: () => set({ obsBrowserSourceUrl: `http://localhost:3000/api/image?t=${Date.now()}` }),
      generateBrowserSourceUrl: () => set((state) => ({ 
        obsBrowserSourceUrl: `${window.location.origin}/api/image?t=${Date.now()}` 
      })),
      debugLog: [],
      addLogEntry: (message, details) => set((state) => ({
        debugLog: [
          { message, timestamp: new Date().toISOString(), details },
          ...state.debugLog.slice(0, 19) // Keep only the last 20 entries
        ]
      })),
      broadcasterId: null,
      setBroadcasterId: (id) => set({ broadcasterId: id }),
    }),
    {
      name: 'background-changer-storage',
    }
  )
)
