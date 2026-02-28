import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const decode = require('heic-decode');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Decode HEIC to raw pixel data, then encode as JPEG via sharp
    const { width, height, data } = await decode({ buffer });
    const jpegBuffer = await sharp(Buffer.from(data), {
      raw: { width, height, channels: 4 },
    }).jpeg({ quality: 90 }).toBuffer();

    return new NextResponse(jpegBuffer, {
      headers: { 'Content-Type': 'image/jpeg' },
    });
  } catch (error) {
    console.error('Image conversion error:', error);
    return NextResponse.json({ error: 'Failed to convert image' }, { status: 500 });
  }
}
