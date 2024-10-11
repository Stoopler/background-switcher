'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '../store/appStore'
import Image from 'next/image'

interface UserProfile {
  displayName: string
  profilePictureUrl: string
}

export function UserProfileDisplay() {
  const { twitchConnected, twitchAccessToken } = useAppStore()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    if (twitchConnected && twitchAccessToken) {
      fetchUserProfile(twitchAccessToken)
    } else {
      setUserProfile(null)
    }
  }, [twitchConnected, twitchAccessToken])

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
        setUserProfile({
          displayName: data.data[0].display_name,
          profilePictureUrl: data.data[0].profile_image_url
        })
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setUserProfile(null)
    }
  }

  if (!userProfile) return null

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium">Welcome, {userProfile.displayName}</span>
      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-500 shadow-sm">
        <Image
          src={userProfile.profilePictureUrl}
          alt={userProfile.displayName}
          width={32}
          height={32}
          className="object-cover"
        />
      </div>
    </div>
  )
}