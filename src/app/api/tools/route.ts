
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { encodeGeohash, prefixForRadius } from '../../../lib/geoutils'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { ownerId, title, category, pricePerDay, deposit, photos, lat, lng, addressHint, description } = body
  if (!ownerId || !title || !category || !pricePerDay || !deposit || !lat || !lng) {
    return new NextResponse('Missing fields', { status: 400 })
  }
  const gh = encodeGeohash(lat, lng, 8)
  const tool = await prisma.tool.create({
    data: { ownerId, title, category, pricePerDay, deposit, photos: photos ?? [], lat, lng, geohash: gh, addressHint, description }
  })
  return NextResponse.json(tool)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = Number(searchParams.get('lat'))
  const lng = Number(searchParams.get('lng'))
  if (Number.isNaN(lat) || Number.isNaN(lng)) return NextResponse.json([])
  const prefix = prefixForRadius(lat, lng)
  const tools = await prisma.tool.findMany({
    where: { geohash: { startsWith: prefix }, isActive: true },
    take: 100
  })
  return NextResponse.json(tools)
}
