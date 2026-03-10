import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    name: 'alti.tune desktop api',
    version: '1.0.0',
    endpoints: ['/api/desktop-content'],
  })
}