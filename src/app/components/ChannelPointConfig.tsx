'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAppStore } from '../store/appStore'

interface TwitchReward {
  id: string
  title: string
  cost: number
  prompt: string
  is_enabled: boolean
}

function ChannelPointConfig() {
  const { twitchAccessToken, channelPointReward, setChannelPointReward } = useAppStore()
  const [rewardTitle, setRewardTitle] = useState('')
  const [rewardCost, setRewardCost] = useState('')
  const [rewardPrompt, setRewardPrompt] = useState('')
  const [broadcasterId, setBroadcasterId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)

  useEffect(() => {
    if (twitchAccessToken) {
      fetchBroadcasterId()
    }
  }, [twitchAccessToken])

  useEffect(() => {
    if (channelPointReward) {
      setRewardTitle(channelPointReward.title)
      setRewardCost(channelPointReward.cost.toString())
      setRewardPrompt(channelPointReward.prompt)
    }
  }, [channelPointReward])

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessMessage])

  const clearFormFields = () => {
    setRewardTitle('')
    setRewardCost('')
    setRewardPrompt('')
  }

  const fetchBroadcasterId = async () => {
    try {
      const response = await fetch('https://api.twitch.tv/helix/users', {
        headers: {
          'Authorization': `Bearer ${twitchAccessToken}`,
          'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!
        }
      })
      const data = await response.json()
      if (data.data && data.data.length > 0) {
        setBroadcasterId(data.data[0].id)
        fetchExistingReward(data.data[0].id)
      }
    } catch (err) {
      console.error('Error fetching broadcaster ID:', err)
      setError('Failed to fetch broadcaster ID')
    }
  }

  const fetchExistingReward = async (broadcasterId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}`, {
        headers: {
          'Authorization': `Bearer ${twitchAccessToken}`,
          'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!
        }
      })
      const data = await response.json()
      const existingReward = data.data.find((reward: TwitchReward) => reward.title === channelPointReward?.title)
      if (existingReward) {
        setChannelPointReward({
          id: existingReward.id,
          title: existingReward.title,
          cost: existingReward.cost,
          prompt: existingReward.prompt || '',
          is_enabled: existingReward.is_enabled
        })
      }
    } catch (err) {
      console.error('Error fetching existing reward:', err)
      setError('Failed to fetch existing reward')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveReward = async () => {
    if (!broadcasterId) {
      setError('Broadcaster ID not available')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const url = channelPointReward?.id
        ? `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}&id=${channelPointReward.id}`
        : `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}`
      
      const method = channelPointReward?.id ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${twitchAccessToken}`,
          'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: rewardTitle,
          cost: parseInt(rewardCost),
          prompt: rewardPrompt,
          is_enabled: true,
          should_redemptions_skip_request_queue: true
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to save reward: ${errorData.message || response.statusText}`)
      }

      const data = await response.json()
      const savedReward = data.data[0] as TwitchReward
      setChannelPointReward({
        id: savedReward.id,
        title: savedReward.title,
        cost: savedReward.cost,
        prompt: savedReward.prompt || '',
        is_enabled: savedReward.is_enabled
      })
      setSuccessMessage(channelPointReward?.id ? 'Reward Updated!' : 'Reward Created!')
      setShowSuccessMessage(true)
    } catch (err) {
      console.error('Error saving reward:', err)
      setError(err instanceof Error ? err.message : 'Failed to save reward')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleReward = async () => {
    if (!broadcasterId || !channelPointReward) return

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}&id=${channelPointReward.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${twitchAccessToken}`,
          'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_enabled: !channelPointReward.is_enabled
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to ${channelPointReward.is_enabled ? 'disable' : 'enable'} reward`)
      }

      const data = await response.json()
      const updatedReward = data.data[0] as TwitchReward
      setChannelPointReward({
        ...updatedReward,
        is_enabled: !channelPointReward.is_enabled
      })
      setSuccessMessage(`Reward ${channelPointReward.is_enabled ? 'Disabled' : 'Enabled'}!`)
      setShowSuccessMessage(true)
    } catch (err) {
      console.error(`Error ${channelPointReward.is_enabled ? 'disabling' : 'enabling'} reward:`, err)
      setError(err instanceof Error ? err.message : `Failed to ${channelPointReward.is_enabled ? 'disable' : 'enable'} reward`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteReward = async () => {
    if (!broadcasterId || !channelPointReward) return

    if (!deleteConfirmation) {
      setDeleteConfirmation(true)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}&id=${channelPointReward.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${twitchAccessToken}`,
          'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete reward')
      }

      setChannelPointReward(null)
      clearFormFields()
      setSuccessMessage('Reward Deleted!')
      setShowSuccessMessage(true)
    } catch (err) {
      console.error('Error deleting reward:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete reward')
    } finally {
      setIsLoading(false)
      setDeleteConfirmation(false)
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Channel Point Configuration</h2>
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Reward Title"
          value={rewardTitle}
          onChange={(e) => setRewardTitle(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Reward Cost"
          value={rewardCost}
          onChange={(e) => setRewardCost(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Reward Prompt"
          value={rewardPrompt}
          onChange={(e) => setRewardPrompt(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button onClick={handleSaveReward} disabled={isLoading || !broadcasterId}>
              {isLoading ? 'Saving...' : 'Save Reward'}
            </Button>
            {channelPointReward && (
              <Button 
                onClick={handleToggleReward} 
                disabled={isLoading || !broadcasterId}
                variant="secondary"
              >
                {channelPointReward.is_enabled ? 'Disable' : 'Enable'}
              </Button>
            )}
          </div>
          {channelPointReward && (
            <Button
              onClick={handleDeleteReward}
              variant="destructive"
              className={`${deleteConfirmation ? 'animate-pulse' : ''}`}
              disabled={isLoading || !broadcasterId}
            >
              {deleteConfirmation ? 'Really?' : 'Delete'}
            </Button>
          )}
        </div>
        {showSuccessMessage && (
          <p className="text-green-500 transition-opacity duration-300 ease-in-out opacity-100">
            {successMessage}
          </p>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  )
}

export default ChannelPointConfig
