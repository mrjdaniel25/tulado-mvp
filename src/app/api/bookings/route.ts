
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { toolId, renterId, startDate, endDate, delivery, addressNote } = body
  const tool = await prisma.tool.findUnique({ where: { id: toolId } })
  if (!tool) return new NextResponse('Tool not found', { status: 404 })
  const s = new Date(startDate).getTime()
  const e = new Date(endDate).getTime()
  if (Number.isNaN(s) || Number.isNaN(e) || e <= s) return new NextResponse('Invalid dates', { status: 400 })
  const days = Math.max(1, Math.ceil((e - s) / 86400000))
  const totalCents = tool.pricePerDay * days
  const depositCents = tool.deposit
  const booking = await prisma.booking.create({
    data: { toolId, ownerId: tool.ownerId, renterId, startDate, endDate, totalCents, depositCents, delivery, addressNote }
  })
  return NextResponse.json(booking)
}
