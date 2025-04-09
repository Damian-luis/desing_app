import { NextRequest, NextResponse } from 'next/server'


const FILE_STORAGE = new Map<string, { data: Buffer; type: string }>()


export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename
  

  const file = FILE_STORAGE.get(filename)
  if (file) {
    return new NextResponse(file.data, {
      status: 200,
      headers: {
        'Content-Type': file.type,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
  
  return NextResponse.json(
    { error: 'File not found', message: 'This is a placeholder API for file storage when Supabase is unavailable' },
    { status: 404 }
  )
}

export async function POST(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename
    const contentType = request.headers.get('content-type') || 'application/octet-stream'
    
    const data = await request.arrayBuffer()
    
    FILE_STORAGE.set(filename, {
      data: Buffer.from(data),
      type: contentType,
    })
    
    
    return NextResponse.json({
      success: true,
      url: `/api/files/${filename}`,
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file', message: 'Internal server error' },
      { status: 500 }
    )
  }
} 