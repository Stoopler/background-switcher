import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const token = request.cookies.get('twitch_access_token')?.value

  if (token) {
    return NextResponse.json({ token })
  } else {
    return NextResponse.json({ token: null })
  }
}