'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

function OBSConfig() {
  const [websocketUrl, setWebsocketUrl] = useState('')
  const [port, setPort] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [imageSources, setImageSources] = useState([])
  const [selectedSource, setSelectedSource] = useState('')

  const handleConnect = () => {
    // TODO: Implement OBS WebSocket connection
    setIsConnected(true)
    setImageSources(['Source 1', 'Source 2', 'Source 3']) // Example sources
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">OBS Configuration</h2>
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="WebSocket URL"
          value={websocketUrl}
          onChange={(e) => setWebsocketUrl(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Port"
          value={port}
          onChange={(e) => setPort(e.target.value)}
        />
        <Button onClick={handleConnect} disabled={isConnected}>
          {isConnected ? 'Connected' : 'Connect to OBS'}
        </Button>
        {isConnected && (
          <Select onValueChange={setSelectedSource} value={selectedSource}>
            <SelectTrigger>
              <SelectValue placeholder="Select image source" />
            </SelectTrigger>
            <SelectContent>
              {imageSources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  )
}

export default OBSConfig