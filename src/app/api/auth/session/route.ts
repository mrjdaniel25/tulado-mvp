
import { NextResponse } from 'next/server'

export async function GET() {
  // Mock de sesión para dev. Sustituir por Supabase Auth
  return NextResponse.json({ user: { id: 'demo', email: 'demo@tulado.app' } })
}
