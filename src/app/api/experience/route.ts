import { NextRequest, NextResponse } from 'next/server'
import { getExperience, createExperience, updateExperience, deleteExperience } from '@/lib/data'

export async function GET() {
  try {
    const experience = await getExperience()
    return NextResponse.json(experience)
  } catch (error) {
    console.error('Error fetching experience:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const exp = await createExperience(body)
    return NextResponse.json(exp, { status: 201 })
  } catch (error) {
    console.error('Error creating experience:', error)
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    const exp = await updateExperience(id, data)
    return NextResponse.json(exp)
  } catch (error) {
    console.error('Error updating experience:', error)
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }
    await deleteExperience(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting experience:', error)
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 })
  }
}
