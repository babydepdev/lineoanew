import { cloudinary } from './config';

export async function uploadImage(file: string, options?: { folder?: string }): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: options?.folder || 'line-accounts',
      resource_type: 'image'
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
}