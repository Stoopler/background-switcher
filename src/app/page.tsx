'use client'

import React, { useEffect, useState, useCallback } from "react"
import { useAppStore } from './store/appStore'
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { CheckCircle2, XCircle } from "lucide-react"
import TwitchAuth from "./components/TwitchAuth"
import ChannelPointConfig from "./components/ChannelPointConfig"
import OBSConfig from "./components/OBSConfig"
import { UserProfileDisplay } from "./components/UserProfileDisplay"
import { useOBSWebSocket } from "./hooks/useOBSWebSocket"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Component() {
  const { 
    twitchConnected, 
    obsConnected,
    setObsConnected, 
    openAIConnected,
    showSettings,
    setTwitchConnected,
    setTwitchAccessToken,
    setShowSettings,
    setOpenAIConnected, // Remove this line if you're not using setOpenAIConnected
    obsSourceType,
    obsSelectedSource,
    setObsSelectedSource,
    obsBrowserSourceUrl,
    generateBrowserSourceUrl
  } = useAppStore()
  const { connect: connectOBS, disconnect: disconnectOBS, getImageSources, error: obsError, isConnected } = useOBSWebSocket()
  const [imageSources, setImageSources] = useState<string[]>([])
  const [selectedSource, setSelectedSource] = useState('')

  useEffect(() => {
    const checkForToken = async () => {
      const response = await fetch('/api/auth/check-token')
      if (response.ok) {
        const { token } = await response.json()
        if (token) {
          setTwitchAccessToken(token)
          setTwitchConnected(true)
          await fetch('/api/auth/clear-token')
        }
      }
    }

    checkForToken()
  }, [setTwitchAccessToken, setTwitchConnected])

  useEffect(() => {
    setObsConnected(isConnected)
  }, [isConnected, setObsConnected])

  const fetchImageSources = useCallback(async () => {
    try {
      const sources = await getImageSources()
      setImageSources(sources)
      if (sources.length === 0) {
        console.warn('No image sources found in OBS')
      }
    } catch (error) {
      console.error('Error fetching image sources:', error)
      setImageSources([])
    }
  }, [getImageSources]);  

  useEffect(() => {
    if (obsConnected) {
      fetchImageSources()
    } else {
      setImageSources([])
    }
  }, [obsConnected, fetchImageSources])

  useEffect(() => {
    if (obsConnected && obsSourceType === 'browser' && !obsBrowserSourceUrl) {
      generateBrowserSourceUrl()
    }
  }, [obsConnected, obsSourceType, obsBrowserSourceUrl, generateBrowserSourceUrl])

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
      {/* Top menu bar */}
      <div className="bg-gray-200 p-1 flex justify-between items-center">
        <div className="flex">
          <button className="px-2 py-1 text-sm hover:bg-gray-300">File</button>
          <button 
            className="px-2 py-1 text-sm hover:bg-gray-300"
            onClick={() => setShowSettings(true)}
          >
            Settings
          </button>
          <button className="px-2 py-1 text-sm hover:bg-gray-300">Help</button>
        </div>
        <UserProfileDisplay />
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Configure your connections and preferences here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-4">
              <TwitchAuth />
              <OBSConfig
                connect={connectOBS}
                disconnect={disconnectOBS}
                obsError={obsError}
                isConnected={isConnected}
              />
            </div>
            <div>
              <ChannelPointConfig />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main content area */}
      <div className="flex-1 p-4 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Stoopler Tools</h1>
        <h4 className="text-1xl mb-4">Channel Point AI Generated Background Changer</h4>
        <div className="space-y-4">
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

          {obsConnected && (
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">OBS Source Configuration</h2>
              {obsSourceType === 'image' ? (
                <>
                  <Label htmlFor="image-source" className="block mb-1">Select Image Source:</Label>
                  <Select
                    value={obsSelectedSource}
                    onValueChange={setObsSelectedSource}
                    onOpenChange={fetchImageSources}
                  >
                    <SelectTrigger id="image-source" className="w-full">
                      <SelectValue placeholder="Select Image Source" />
                    </SelectTrigger>
                    <SelectContent>
                      {imageSources.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <div>
                  <p className="mb-1">Browser Source URL:</p>
                  <div className="flex items-center space-x-2">
                    <Input value={obsBrowserSourceUrl} readOnly className="flex-grow" />
                    <Button onClick={generateBrowserSourceUrl} size="sm">Refresh URL</Button>
                  </div>
                  <p className="text-sm mt-1">Use this URL to create a browser source in OBS.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-gray-200 p-1 text-sm">
        Stoopler Tools, ayo?
      </div>
    </div>
  )
}
