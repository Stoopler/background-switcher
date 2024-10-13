'use client'

import { useChannelPointRedemptions } from '../hooks/useChannelPointRedemptions'
import { Button } from '@/components/ui/button'
import { useAppStore } from '../store/appStore'

export function RedemptionHandler() {
  const redemptions = useChannelPointRedemptions()
  const { twitchAccessToken, channelPointReward, broadcasterId, addLogEntry } = useAppStore()

  const handleRedemption = async (redemptionId: string, userInput: string, userName: string) => {
    addLogEntry('Channel Point Redeemed', `User: ${userName}, Input: ${userInput}`)

    // Here you would call your image generation API with the user input
    console.log(`Generating image for: ${userInput}`)

    // After generating the image, update the redemption status
    try {
      const response = await fetch(`https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=${broadcasterId}&reward_id=${channelPointReward?.id}&id=${redemptionId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${twitchAccessToken}`,
          'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'FULFILLED'
        })
      })

      if (!response.ok) throw new Error('Failed to update redemption status')
      addLogEntry('Redemption Fulfilled', `RedemptionID: ${redemptionId}`)
    } catch (error) {
      console.error('Error updating redemption status:', error)
      addLogEntry('Error Fulfilling Redemption', `RedemptionID: ${redemptionId}`)
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Recent Redemptions</h2>
      {redemptions.length === 0 ? (
        <p>No pending redemptions</p>
      ) : (
        <ul className="space-y-2">
          {redemptions.map((redemption) => (
            <li key={redemption.id} className="flex items-center justify-between">
              <span>{redemption.user_name}: {redemption.user_input}</span>
              <Button onClick={() => handleRedemption(redemption.id, redemption.user_input, redemption.user_name)} size="sm">
                Generate
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
