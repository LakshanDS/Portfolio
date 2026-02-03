import { NextRequest, NextResponse } from 'next/server'
import { getAboutCards, createAboutCard, updateAboutCard, deleteAboutCard } from '@/lib/data'
import { requireAuth } from '@/lib/api-auth'

export async function GET() {
  try {
    const cards = await getAboutCards()
    return NextResponse.json(cards)
  } catch (error) {
    console.error('Error fetching about cards:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json()
    const card = await createAboutCard(body)
    return NextResponse.json(card, { status: 201 })
  } catch (error) {
    console.error('Error creating about card:', error)
    return NextResponse.json({ error: 'Failed to create about card' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json()
    const { id, ...data } = body
    const card = await updateAboutCard(id, data)
    return NextResponse.json(card)
  } catch (error) {
    console.error('Error updating about card:', error)
    return NextResponse.json({ error: 'Failed to update about card' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }
    await deleteAboutCard(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting about card:', error)
    return NextResponse.json({ error: 'Failed to delete about card' }, { status: 500 })
  }
}
