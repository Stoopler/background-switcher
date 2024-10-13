'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAppStore } from '../store/appStore'

function ChannelPointConfig() {
  const { 
    twitchAccessToken, 
    channelPointReward, 
    setChannelPointReward, 
    addLogEntry,
    broadcasterId
  } = useAppStore()

  const [rewardTitle, setRewardTitle] = useState('AI Background Change')
  const [rewardCost, setRewardCost] = useState('')
  const [rewardPrompt, setRewardPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)

  const fetchExistingReward = useCallback(async () => {
    if (!twitchAccessToken || !broadcasterId || channelPointReward) return

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
      const existingReward = data.data.find((reward: any) => reward.title === rewardTitle)
      if (existingReward) {
        setChannelPointReward({
          id: existingReward.id,
          broadcaster_id: broadcasterId,
          title: existingReward.title,
          cost: existingReward.cost,
          prompt: existingReward.prompt || '',
          is_enabled: existingReward.is_enabled
        })
        setRewardCost(existingReward.cost.toString())
        setRewardPrompt(existingReward.prompt || '')
        addLogEntry('Existing reward found')
      } else {
        addLogEntry('No existing reward found')
      }
    } catch (err) {
      console.error('Error fetching existing reward:', err)
      setError('Failed to fetch existing reward')
    } finally {
      setIsLoading(false)
    }
  }, [twitchAccessToken, broadcasterId, channelPointReward, rewardTitle, setChannelPointReward, addLogEntry])

  useEffect(() => {
    if (twitchAccessToken && broadcasterId && !channelPointReward) {
      fetchExistingReward()
    }
  }, [twitchAccessToken, broadcasterId, channelPointReward, fetchExistingReward])

  const clearFormFields = () => {
    setRewardTitle('')
    setRewardCost('')
    setRewardPrompt('')
  }

  const handleSaveReward = async () => {
    if (!broadcasterId) {
      setError('Broadcaster ID not available')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const endpoint = channelPointReward
        ? `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}&id=${channelPointReward.id}`
        : `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}`

      const method = channelPointReward ? 'PATCH' : 'POST'

      const response = await fetch(endpoint, {
        method: method,
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
          should_redemptions_skip_request_queue: true,
          is_user_input_required: true
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to save reward: ${errorData.message || response.statusText}`)
      }

      const data = await response.json()
      const savedReward = data.data[0]
      setChannelPointReward({
        id: savedReward.id,
        broadcaster_id: broadcasterId,
        title: savedReward.title,
        cost: savedReward.cost,
        prompt: savedReward.prompt || '',
        is_enabled: savedReward.is_enabled
      })
      addLogEntry(channelPointReward ? 'Reward Updated' : 'Reward Created')
    } catch (err) {
      console.error('Error saving reward:', err)
      setError(err instanceof Error ? err.message : 'Failed to save reward')
      addLogEntry('Error saving reward')
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
      const updatedReward = data.data[0]
      setChannelPointReward({
        ...channelPointReward,
        is_enabled: !channelPointReward.is_enabled
      })
      addLogEntry(`Reward ${channelPointReward.is_enabled ? 'Disabled' : 'Enabled'}`)
    } catch (err) {
      console.error(`Error ${channelPointReward.is_enabled ? 'disabling' : 'enabling'} reward:`, err)
      setError(err instanceof Error ? err.message : `Failed to ${channelPointReward.is_enabled ? 'disable' : 'enable'} reward`)
      addLogEntry(`Error ${channelPointReward.is_enabled ? 'disabling' : 'enabling'} reward`)
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
      addLogEntry('Reward Deleted')
    } catch (err) {
      console.error('Error deleting reward:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete reward')
      addLogEntry('Error deleting reward')
    } finally {
      setIsLoading(false)
      setDeleteConfirmation(false)
    }
  }

  return (
    <div className="bg-white p-3 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Channel Point Config</h2>
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Reward Title"
          value={rewardTitle}
          onChange={(e) => setRewardTitle(e.target.value)}
        />
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="Cost"
            value={rewardCost}
            onChange={(e) => setRewardCost(e.target.value)}
            className="w-1/2"
          />
          <Input
            type="text"
            placeholder="Prompt"
            value={rewardPrompt}
            onChange={(e) => setRewardPrompt(e.target.value)}
            className="w-1/2"
          />
        </div>
        <div className="flex items-center justify-between">
          <Button 
            onClick={handleSaveReward} 
            disabled={isLoading || !broadcasterId} 
            size="sm"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
          {channelPointReward && (
            <>
              <Button 
                onClick={handleToggleReward} 
                disabled={isLoading || !broadcasterId}
                variant="secondary"
                size="sm"
              >
                {channelPointReward.is_enabled ? 'Disable' : 'Enable'}
              </Button>
              <Button
                onClick={handleDeleteReward}
                variant="destructive"
                className={`${deleteConfirmation ? 'animate-pulse' : ''}`}
                disabled={isLoading || !broadcasterId}
                size="sm"
              >
                {deleteConfirmation ? 'Really?' : 'Delete'}
              </Button>
            </>
          )}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <p className="text-sm text-gray-500">Broadcaster ID: {broadcasterId || 'Not set'}</p>
      </div>
    </div>
  )
}

export default ChannelPointConfig
