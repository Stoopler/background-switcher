'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '../store/appStore'

function TwitchAuth() {
  const { 
    twitchConnected, 
    twitchAccessToken,
    setTwitchConnected,
    setTwitchAccessToken,
    setBroadcasterId
  } = useAppStore()

  useEffect(() => {
    if (twitchAccessToken) {
      fetchUserProfile(twitchAccessToken)
    }
  }, [twitchAccessToken])

  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID
    const redirectUri = process.env.NODE_ENV === 'development'
      ? `http://localhost:3000/api/twitch/callback`
      : 'background-changer://oauth/callback'
    const scopes = 'channel:read:redemptions channel:manage:redemptions'

    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scopes}`

    window.location.href = authUrl
  }

  const handleLogout = () => {
    setTwitchAccessToken(null)
    setTwitchConnected(false)
  }

  const fetchUserProfile = async (accessToken: string) => {
    try {
      const response = await fetch('https://api.twitch.tv/helix/users', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!
        }
      })
      const data = await response.json()
      if (data.data && data.data.length > 0) {
        setTwitchConnected(true)
        setTwitchAccessToken(accessToken)
        setBroadcasterId(data.data[0].id)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      handleLogout()
    }
  }

  return (
    <div className="bg-white p-3 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Twitch Auth</h2>
        {twitchConnected ? (
          <Button onClick={handleLogout} size="sm" variant="outline" className="bg-red-100 hover:bg-red-200 text-red-700">
            Disconnect
          </Button>
        ) : (
          <Button onClick={handleLogin} size="sm" variant="outline" className="bg-purple-100 hover:bg-purple-200 text-purple-700">
            Connect
          </Button>
        )}
      </div>
    </div>
  )
}

export default TwitchAuth
