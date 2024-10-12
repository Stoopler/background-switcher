'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '../store/appStore'

function TwitchAuth() {
  const { 
    twitchConnected, 
    twitchAccessToken,
    setTwitchConnected,
    setTwitchAccessToken
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
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      handleLogout()
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Twitch Authentication</h2>
      {twitchConnected ? (
        <Button onClick={handleLogout} className="w-full bg-[#6441a5] hover:bg-[#7d5bbe] text-white">
          Disconnect from Twitch
        </Button>
      ) : (
        <Button onClick={handleLogin} className="w-full bg-[#6441a5] hover:bg-[#7d5bbe] text-white">
          Authenticate with Twitch
        </Button>
      )}
    </div>
  )
}

export default TwitchAuth
