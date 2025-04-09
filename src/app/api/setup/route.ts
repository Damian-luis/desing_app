import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: jwtData, error: jwtError } = await supabase.rpc('check_jwt_role')
    
    if (jwtError) {
      return NextResponse.json({
        error: 'Failed to get JWT data',
        details: jwtError
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      jwtData
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to get JWT data', details: error },
      { status: 500 }
    )
  }
} 