import { CanvasFactory } from 'pdf-parse/worker'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PDFParse } from 'pdf-parse'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds the 10MB limit.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const mimeType = file.type
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''

    let text = ''

    if (mimeType === 'text/plain' || ext === 'txt') {
      // Plain text — just decode UTF-8
      text = buffer.toString('utf-8')
    } else if (mimeType === 'application/pdf' || ext === 'pdf') {
      const parser = new PDFParse({ data: buffer, CanvasFactory: new CanvasFactory() })
      const pdfData = await parser.getText()
      text = pdfData.text
      if (!text.trim()) {
        return NextResponse.json({ error: 'Could not extract text from this PDF. It may be a scanned/image-only PDF. Try copying and pasting the text instead.' }, { status: 422 })
      }
    } else if (['doc', 'docx'].includes(ext)) {
      // Best-effort text extraction for Word docs — strip binary noise
      text = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s{3,}/g, '  ').trim()
      if (!text.trim()) {
        return NextResponse.json({ error: 'Could not extract text from this file. Try copying and pasting the text instead.' }, { status: 422 })
      }
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF, TXT, DOC, or DOCX file.' }, { status: 400 })
    }

    return NextResponse.json({ text: text.trim() })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 })
  }
}

