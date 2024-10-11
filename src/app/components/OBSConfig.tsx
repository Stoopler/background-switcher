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
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">OBS Configuration</h2>
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="WebSocket URL"
          value={obsWebsocketUrl}
          onChange={(e) => setObsWebsocketUrl(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Port"
          value={obsPort}
          onChange={(e) => setObsPort(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={obsPassword}
          onChange={(e) => setObsPassword(e.target.value)}
        />
        <Button onClick={isConnected ? disconnect : handleConnect}>
          {isConnected ? 'Disconnect from OBS' : 'Connect to OBS'}
        </Button>
        {obsError && <p className="text-red-500">{obsError}</p>}
      </div>
    </div>
  )
}

export default OBSConfig
