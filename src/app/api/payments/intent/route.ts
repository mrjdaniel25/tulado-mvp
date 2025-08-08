
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' })

export async function POST(req: NextRequest) {
  const { bookingId } = await req.json()
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
  if (!booking) return new NextResponse('Booking not found', { status: 404 })
  if (!process.env.STRIPE_SECRET_KEY) {
    // Dev fallback
    return NextResponse.json({ clientSecret: 'demo_pi', setupSecret: 'demo_si' })
  }
  // Create PaymentIntent for rental total
  const pi = await stripe.paymentIntents.create({
    amount: booking.totalCents,
    currency: 'usd',
    capture_method: 'automatic',
    metadata: { bookingId }
  })
  // Create SetupIntent to hold a payment method for deposit (to capture if damage occurs)
  const si = await stripe.setupIntents.create({
    usage: 'off_session',
    metadata: { bookingId }
  })
  return NextResponse.json({ clientSecret: pi.client_secret, setupSecret: si.client_secret })
}
