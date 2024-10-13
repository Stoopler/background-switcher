'use client'

import { useChannelPointRedemptions } from '../hooks/useChannelPointRedemptions'
import { useAppStore } from '../store/appStore'

interface RedemptionQueueProps {
  maxItems?: number
}

export function RedemptionQueue({ maxItems = 10 }: RedemptionQueueProps) {
  const redemptions = useChannelPointRedemptions()
  const { addLogEntry } = useAppStore()

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Redemption Queue</h2>
      {redemptions.length === 0 ? (
        <p>No recent redemptions</p>
      ) : (
        <ul className="space-y-2">
          {redemptions.slice(0, maxItems).map((redemption) => (
            <li key={redemption.id} className="text-sm border-b pb-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{redemption.user_name}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  redemption.status === 'FULFILLED' ? 'bg-green-100 text-green-800' :
                  redemption.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {redemption.status}
                </span>
              </div>
              <div className="text-gray-600">{redemption.user_input}</div>
              <div className="text-xs text-gray-400">
                {new Date(redemption.redeemed_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
