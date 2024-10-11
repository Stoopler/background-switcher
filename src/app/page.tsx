'use client'

import { useEffect } from "react"
import { useAppStore } from './store/appStore'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CheckCircle2, XCircle } from "lucide-react"
import TwitchAuth from "./components/TwitchAuth"
import ChannelPointConfig from "./components/ChannelPointConfig"
import OBSConfig from "./components/OBSConfig"
import { UserProfileDisplay } from "./components/UserProfileDisplay"

export default function Component() {
  const { 
    twitchConnected, 
    obsConnected, 
    openAIConnected,
    showSettings,
    setTwitchConnected,
    setTwitchAccessToken,
    setShowSettings
  } = useAppStore()

  useEffect(() => {
    const checkForToken = async () => {
      const response = await fetch('/api/auth/check-token')
      if (response.ok) {
        const { token } = await response.json()
        if (token) {
          setTwitchAccessToken(token)
          setTwitchConnected(true)
          // Remove the cookie after we've stored the token
          await fetch('/api/auth/clear-token')
        }
      }
    }

    checkForToken()
  }, [setTwitchAccessToken, setTwitchConnected])

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
      {/* Top menu bar */}
      <div className="bg-gray-200 p-1 flex justify-between items-center">
        <div className="flex">
          <button className="px-2 py-1 text-sm hover:bg-gray-300">File</button>
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <button className="px-2 py-1 text-sm hover:bg-gray-300">Settings</button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <TwitchAuth />
                <OBSConfig />
                <Button variant="outline" className="w-full" onClick={() => setOpenAIConnected(!openAIConnected)}>
                  Set OpenAI API Key
                </Button>
                <ChannelPointConfig />
              </div>
            </DialogContent>
          </Dialog>
          <button className="px-2 py-1 text-sm hover:bg-gray-300">Help</button>
        </div>
        <UserProfileDisplay />
      </div>

      {/* Main content area */}
      <div className="flex-1 p-4 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Twitch & OpenAI Integration</h1>

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

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Image Source</h2>
            <Label htmlFor="image-source" className="block mb-1">Select Image Source:</Label>
            <Select defaultValue="starting-soon">
              <SelectTrigger id="image-source" className="w-full">
                <SelectValue placeholder="Select Image Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="starting-soon">Starting Soon IMG</SelectItem>
                <SelectItem value="be-right-back">Be Right Back IMG</SelectItem>
                <SelectItem value="stream-ended">Stream Ended IMG</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-gray-200 p-1 text-sm">
        Stoopler Tools, ayo?
      </div>
    </div>
  )
}