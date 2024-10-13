'use client'

import { useAppStore } from '../store/appStore'
import { CheckCircle2, XCircle } from "lucide-react"

export function ConnectionStatus() {
  const { twitchConnected, obsConnected, openAIConnected } = useAppStore()

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span>Twitch:</span>
          {twitchConnected ? (
            <span className="text-green-500 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> Connected</span>
          ) : (
            <span className="text-red-500 flex items-center"><XCircle className="w-4 h-4 mr-1" /> Not Connected</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span>OBS:</span>
          {obsConnected ? (
            <span className="text-green-500 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> Connected</span>
          ) : (
            <span className="text-red-500 flex items-center"><XCircle className="w-4 h-4 mr-1" /> Not Connected</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span>OpenAI API:</span>
          {openAIConnected ? (
            <span className="text-green-500 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> Connected</span>
          ) : (
            <span className="text-red-500 flex items-center"><XCircle className="w-4 h-4 mr-1" /> Not Connected</span>
          )}
        </div>
      </div>
    </div>
  )
}
