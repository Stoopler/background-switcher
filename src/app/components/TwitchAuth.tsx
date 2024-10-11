'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

function TwitchAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userProfile, setUserProfile] = useState({ displayName: '', profilePicture: '' })

  const handleLogin = () => {
    // TODO: Implement Twitch OAuth login
    setIsLoggedIn(true)
    setUserProfile({ displayName: 'Example User', profilePicture: 'https://example.com/profile.jpg' })
  }

  const handleLogout = () => {
    // TODO: Implement logout
    setIsLoggedIn(false)
    setUserProfile({ displayName: '', profilePicture: '' })
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Twitch Authentication</h2>
      {isLoggedIn ? (
        <div>
          <div className="flex items-center mb-4">
            <img src={userProfile.profilePicture} alt="Profile" className="w-10 h-10 rounded-full mr-2" />
            <span>{userProfile.displayName}</span>
          </div>
          <Button onClick={handleLogout}>Log Out</Button>
        </div>
      ) : (
        <Button onClick={handleLogin}>Log In with Twitch</Button>
      )}
    </div>
  )
}

export default TwitchAuth