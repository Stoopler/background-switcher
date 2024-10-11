'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function ChannelPointConfig() {
  const [rewardTitle, setRewardTitle] = useState('')
  const [rewardCost, setRewardCost] = useState('')
  const [rewardPrompt, setRewardPrompt] = useState('')

  const handleSaveReward = () => {
    // TODO: Implement saving/updating the channel point reward
    console.log('Saving reward:', { rewardTitle, rewardCost, rewardPrompt })
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
        <Button onClick={handleSaveReward}>Save Reward</Button>
      </div>
    </div>
  )
}

export default ChannelPointConfig