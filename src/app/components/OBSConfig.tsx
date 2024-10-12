'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAppStore } from '../store/appStore'

interface OBSConfigProps {
  connect: (url: string, port: string | number, password: string) => Promise<void>
  disconnect: () => Promise<void>
  obsError: string | null
  isConnected: boolean
}

function OBSConfig({
  connect,
  disconnect,
  obsError,
  isConnected
}: OBSConfigProps) {
  const { 
    obsWebsocketUrl, 
    setObsWebsocketUrl, 
    obsPort, 
    setObsPort,
    obsPassword,
    setObsPassword
  } = useAppStore()

  const handleConnect = async () => {
    await connect(obsWebsocketUrl, obsPort, obsPassword)
  }

  return (
    <div className="bg-white p-3 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">OBS Config</h2>
      <div className="space-y-2">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="WebSocket URL"
            value={obsWebsocketUrl}
            onChange={(e) => setObsWebsocketUrl(e.target.value)}
            className="flex-grow"
          />
          <Input
            type="number"
            placeholder="Port"
            value={obsPort}
            onChange={(e) => setObsPort(e.target.value)}
            className="w-20"
          />
        </div>
        <Input
          type="password"
          placeholder="Password"
          value={obsPassword}
          onChange={(e) => setObsPassword(e.target.value)}
        />
        <Button onClick={isConnected ? disconnect : handleConnect} size="sm" className="w-full">
          {isConnected ? 'Disconnect' : 'Connect'}
        </Button>
        {obsError && <p className="text-red-500 text-sm">{obsError}</p>}
      </div>
    </div>
  )
}

export default OBSConfig
