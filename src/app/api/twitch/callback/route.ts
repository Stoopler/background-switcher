import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect('/error?message=No code provided')
  }

  try {
    const redirectUri = process.env.NODE_ENV === 'development'
      ? `http://localhost:3000/api/twitch/callback`
      : 'background-changer://oauth/callback'

    const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
        client_secret: process.env.TWITCH_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      })
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error(tokenData.message || 'Failed to exchange code for token')
    }

    // Set the access token in an HTTP-only cookie
    const response = NextResponse.redirect('http://localhost:3000')
    response.cookies.set('twitch_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    return response
  } catch (error) {
    console.error('Error in Twitch callback:', error)
    return NextResponse.redirect('/error?message=Authentication failed')
  }
}