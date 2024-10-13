'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAppStore } from '../store/appStore'

export function OpenAIConfig() {
  const { 
    openAIApiKey, 
    setOpenAIApiKey, 
    openAIOrganizationId, 
    setOpenAIOrganizationId,
    setOpenAIConnected
  } = useAppStore()

  const [apiKey, setApiKey] = useState(openAIApiKey)
  const [orgId, setOrgId] = useState(openAIOrganizationId)

  const handleSave = async () => {
    setOpenAIApiKey(apiKey)
    setOpenAIOrganizationId(orgId)

    // Test the connection
    try {
      const response = await fetch('/api/openai/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey, orgId }),
      })

      if (response.ok) {
        setOpenAIConnected(true)
        alert('OpenAI connection successful!')
      } else {
        setOpenAIConnected(false)
        alert('Failed to connect to OpenAI. Please check your credentials.')
      }
    } catch (error) {
      console.error('Error testing OpenAI connection:', error)
      setOpenAIConnected(false)
      alert('An error occurred while testing the OpenAI connection.')
    }
  }

  return (
    <div className="bg-white p-3 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">OpenAI Configuration</h2>
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Organization ID (optional)"
          value={orgId}
          onChange={(e) => setOrgId(e.target.value)}
        />
        <Button onClick={handleSave} className="w-full">Save and Test Connection</Button>
      </div>
    </div>
  )
}
