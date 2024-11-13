import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = cookies()
  const sessionCartId = cookieStore.get('sessionCartId')

  return NextResponse.json({
    sessionCartId: sessionCartId?.value
  })
} 