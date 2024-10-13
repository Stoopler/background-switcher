import OpenAI from 'openai'

export async function generateImage(prompt: string, apiKey: string, orgId: string) {
  const openai = new OpenAI({
    apiKey: apiKey,
    organization: orgId,
  })

  try {
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
    })

    return response.data[0].url
  } catch (error) {
    console.error('Error generating image:', error)
    throw error
  }
}
