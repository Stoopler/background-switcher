'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from '../store/appStore'

interface OBSConfigProps {
  connect: (url: string, port: string | number, password: string) => Promise<void>
  disconnect: () => Promise<void>
  getImageSources: () => Promise<string[]>
  obsError: string | null
  isConnected: boolean
}

function OBSConfig({
  connect,
  disconnect,
  getImageSources,
  obsError,
  isConnected
}: OBSConfigProps) {
  const { 
    obsWebsocketUrl, 
    setObsWebsocketUrl, 
    obsPort, 
    setObsPort,
    obsPassword,
    setObsPassword,
    obsSourceType,
    setObsSourceType,
    obsSelectedSource,
    setObsSelectedSource,
    obsBrowserSourceUrl,
    generateBrowserSourceUrl
  } = useAppStore()

  const [imageSources, setImageSources] = useState<string[]>([])

  const handleConnect = async () => {
    await connect(obsWebsocketUrl, obsPort, obsPassword)
  }

  const handleSourceTypeChange = (type: 'image' | 'browser') => {
    setObsSourceType(type)
    if (type === 'browser' && !obsBrowserSourceUrl) {
      generateBrowserSourceUrl()
    } else if (type === 'image') {
      fetchImageSources()
    }
  }

  const fetchImageSources = useCallback(async () => {
    if (isConnected && obsSourceType === 'image') {
      try {
        const sources = await getImageSources()
        setImageSources(sources)
      } catch (error) {
        console.error('Error fetching image sources:', error)
      }
    }
  }, [isConnected, obsSourceType, getImageSources])

  useEffect(() => {
    fetchImageSources()
  }, [fetchImageSources])

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
        
        <Select value={obsSourceType} onValueChange={handleSourceTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select source type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image">Image Source</SelectItem>
            <SelectItem value="browser">Browser Source</SelectItem>
          </SelectContent>
        </Select>

        {obsSourceType === 'image' && isConnected && (
          <Select value={obsSelectedSource} onValueChange={setObsSelectedSource}>
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

        {obsSourceType === 'browser' && (
          <div>
            <p className="text-sm mb-1">Browser Source URL:</p>
            <div className="flex items-center space-x-2">
              <Input value={obsBrowserSourceUrl} readOnly className="flex-grow" />
              <Button onClick={generateBrowserSourceUrl} size="sm">Refresh</Button>
            </div>
          </div>
        )}

        <Button onClick={isConnected ? disconnect : handleConnect} size="sm" className="w-full">
          {isConnected ? 'Disconnect' : 'Connect'}
        </Button>
        {obsError && <p className="text-red-500 text-sm">{obsError}</p>}
      </div>
    </div>
  )
}

export default OBSConfig
