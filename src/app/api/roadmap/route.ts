import { NextResponse } from 'next/server'
import { getRoadmapItems } from '@/lib/data'

export async function GET() {
  try {
    const items = await getRoadmapItems()
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching roadmap items:', error)
    return NextResponse.json([], { status: 200 })
  }
}
