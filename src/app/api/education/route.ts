import { NextRequest, NextResponse } from 'next/server'
import { getEducation, createEducation, updateEducation, deleteEducation } from '@/lib/data'

export async function GET() {
  try {
    const education = await getEducation()
    return NextResponse.json(education)
  } catch (error) {
    console.error('Error fetching education:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const edu = await createEducation(body)
    return NextResponse.json(edu, { status: 201 })
  } catch (error) {
    console.error('Error creating education:', error)
    return NextResponse.json({ error: 'Failed to create education' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    const edu = await updateEducation(id, data)
    return NextResponse.json(edu)
  } catch (error) {
    console.error('Error updating education:', error)
    return NextResponse.json({ error: 'Failed to update education' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }
    await deleteEducation(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting education:', error)
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 })
  }
}
