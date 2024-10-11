'use client'

import { useState, useEffect } from 'react'

function ConnectionStatus() {
  const [twitchStatus, setTwitchStatus] = useState('Disconnected')
  const [obsStatus, setOBSStatus] = useState('Disconnected')
  const [apiStatus, setAPIStatus] = useState('Disconnected')

  // TODO: Implement actual connection status checks

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="font-medium">Twitch:</p>
          <p className={`${twitchStatus === 'Connected' ? 'text-green-600' : 'text-red-600'}`}>
            {twitchStatus}
          </p>
        </div>
        <div>
          <p className="font-medium">OBS:</p>
          <p className={`${obsStatus === 'Connected' ? 'text-green-600' : 'text-red-600'}`}>
            {obsStatus}
          </p>
        </div>
        <div>
          <p className="font-medium">API:</p>
          <p className={`${apiStatus === 'Connected' ? 'text-green-600' : 'text-red-600'}`}>
            {apiStatus}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ConnectionStatus