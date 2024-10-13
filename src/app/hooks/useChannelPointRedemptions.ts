import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '../store/appStore'

interface Redemption {
  id: string
  user_name: string
  user_input: string
  status: 'UNFULFILLED' | 'FULFILLED' | 'CANCELED'
  redeemed_at: string
}

export function useChannelPointRedemptions() {
  const { twitchAccessToken, channelPointReward, broadcasterId } = useAppStore()
  const [redemptions, setRedemptions] = useState<Redemption[]>([])

  const fetchRedemptions = useCallback(async () => {
    if (!twitchAccessToken || !channelPointReward || !broadcasterId) return

    try {
      const statuses = ['UNFULFILLED', 'FULFILLED', 'CANCELED']
      const fetchPromises = statuses.map(status =>
        fetch(`https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=${broadcasterId}&reward_id=${channelPointReward.id}&status=${status}`, {
          headers: {
            'Authorization': `Bearer ${twitchAccessToken}`,
            'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!
          }
        }).then(response => response.json())
      )

      const results = await Promise.all(fetchPromises)
      const allRedemptions = results.flatMap(result => result.data)

      setRedemptions(allRedemptions.sort((a, b) => new Date(b.redeemed_at).getTime() - new Date(a.redeemed_at).getTime()))
    } catch (error) {
      console.error('Error fetching redemptions:', error)
    }
  }, [twitchAccessToken, channelPointReward, broadcasterId])

  useEffect(() => {
    if (twitchAccessToken && channelPointReward && broadcasterId) {
      fetchRedemptions()
      const interval = setInterval(fetchRedemptions, 5000) // Poll every 5 seconds
      return () => clearInterval(interval)
    }
  }, [twitchAccessToken, channelPointReward, broadcasterId, fetchRedemptions])

  return redemptions
}
