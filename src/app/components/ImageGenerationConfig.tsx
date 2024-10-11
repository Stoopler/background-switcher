'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

function ImageGenerationConfig() {
  const [apiEndpoint, setApiEndpoint] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [prompt, setPrompt] = useState('')
  const [imageSize, setImageSize] = useState('')

  const apiEndpoints = [
    { value: 'openai', label: 'OpenAI (Recommended)' },
    { value: 'stability', label: 'Stability AI' },
    { value: 'midjourney', label: 'Midjourney' },
  ]

  const imageSizes = [
    { value: '256x256', label: '256x256' },
    { value: '512x512', label: '512x512' },
    { value: '1024x1024', label: '1024x1024' },
  ]

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Image Generation Configuration</h2>
      <div className="space-y-4">
        <Select onValueChange={setApiEndpoint} value={apiEndpoint}>
          <SelectTrigger>
            <SelectValue placeholder="Select API endpoint" />
          </SelectTrigger>
          <SelectContent>
            {apiEndpoints.map((endpoint) => (
              <SelectItem key={endpoint.value} value={endpoint.value}>
                {endpoint.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="password"
          placeholder="API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Prompt (pretext)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Select onValueChange={setImageSize} value={imageSize}>
          <SelectTrigger>
            <SelectValue placeholder="Select image size" />
          </SelectTrigger>
          <SelectContent>
            {imageSizes.map((size) => (
              <SelectItem key={size.value} value={size.value}>
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default ImageGenerationConfig