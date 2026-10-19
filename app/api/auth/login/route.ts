import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  if (body.username === 'admin_aw042' && body.pin === '123456') return NextResponse.json({ token: 'mock-jwt-aw042', role: 'ADMIN', name: 'Rekha Tai Patil (Sevika)', centre: 'AW-Center-042' })
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}
