import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '../store/appStore'

interface Redemption {
  id: string
  user_name: string
  user_input: string
  reward: {
    id: string
    title: string
  }
}

export function useChannelPointRedemptions() {
  const { twitchAccessToken, channelPointReward } = useAppStore()
  const [redemptions, setRedemptions] = useState<Redemption[]>([])

  const fetchRedemptions = useCallback(async () => {
    if (!twitchAccessToken || !channelPointReward) return

    try {
      const response = await fetch(`https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=${channelPointReward.broadcaster_id}&reward_id=${channelPointReward.id}&status=unfulfilled`, {
        headers: {
          'Authorization': `Bearer ${twitchAccessToken}`,
          'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!
        }
      })

      if (!response.ok) throw new Error('Failed to fetch redemptions')

      const data = await response.json()
      setRedemptions(data.data)
    } catch (error) {
      console.error('Error fetching redemptions:', error)
    }
  }, [twitchAccessToken, channelPointReward])

  useEffect(() => {
    if (twitchAccessToken && channelPointReward) {
      fetchRedemptions()
      const interval = setInterval(fetchRedemptions, 5000) // Poll every 5 seconds
      return () => clearInterval(interval)
    }
  }, [twitchAccessToken, channelPointReward, fetchRedemptions])

  return redemptions
}
