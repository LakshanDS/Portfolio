import { NextRequest, NextResponse } from 'next/server'
import { getProfile, updateProfile, getProfileStats, updateProfileStats } from '@/lib/data'

export async function GET() {
  try {
    const [profile, stats] = await Promise.all([getProfile(), getProfileStats()])
    return NextResponse.json({ profile, stats })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ profile: null, stats: null }, { status: 200 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, type, ...data } = body
    
    if (type === 'stats') {
      const stats = await updateProfileStats(id, data)
      return NextResponse.json(stats)
    } else {
      const profile = await updateProfile(id, data)
      return NextResponse.json(profile)
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
