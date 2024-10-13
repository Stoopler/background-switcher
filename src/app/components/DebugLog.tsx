'use client'

import { useEffect } from 'react'
import { useAppStore } from '../store/appStore'

interface LogEntry {
  message: string
  timestamp: Date
  details?: string
}

export function DebugLog() {
  const { twitchConnected, obsConnected, channelPointReward, addLogEntry, debugLog } = useAppStore()

  useEffect(() => {
    if (twitchConnected) {
      addLogEntry('Logged in to Twitch')
    }
  }, [twitchConnected, addLogEntry])

  useEffect(() => {
    if (obsConnected) {
      addLogEntry('Connected to OBS')
    }
  }, [obsConnected, addLogEntry])

  useEffect(() => {
    if (channelPointReward) {
      addLogEntry('Channel Point Reward Updated', `Title: ${channelPointReward.title}, Cost: ${channelPointReward.cost}`)
    }
  }, [channelPointReward, addLogEntry])

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Debug Log</h2>
      <ul className="space-y-1">
        {debugLog.map((entry, index) => (
          <li key={index} className="text-sm">
            <span className="text-gray-500">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
            {' - '}
            <span className="font-medium">{entry.message}</span>
            {entry.details && (
              <span className="ml-2 text-gray-600 cursor-help" title={entry.details}>ℹ️</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
