import { NextRequest, NextResponse } from 'next/server';
import { cloudinary } from '@/lib/services/cloudinary/config';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileStr = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary using signed upload
    const result = await cloudinary.uploader.upload(fileStr, {
      folder: 'line-accounts',
      resource_type: 'auto'
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Upload failed' 
      },
      { status: 500 }
    );
  }
}