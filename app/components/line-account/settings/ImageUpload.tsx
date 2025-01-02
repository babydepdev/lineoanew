import { useState, useCallback } from 'react';
import { ImagePlus, Upload } from 'lucide-react';
import { Button } from '../../ui/button';
import { showToast } from '@/app/utils/toast';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string | null;
}

export function ImageUpload({ onUpload, currentImage }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      showToast.error('Invalid file type', {
        description: 'Please upload an image file'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showToast.error('File too large', {
        description: 'Image must be less than 5MB'
      });
      return;
    }

    try {
      setIsUploading(true);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      onUpload(data.secure_url);
      showToast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      showToast.error('Upload failed', {
        description: 'Please try again'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleUpload(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <div className="space-y-4">
      {currentImage && (
        <div className="relative w-40 h-40 rounded-lg overflow-hidden">
          <img 
            src={currentImage} 
            alt="LINE Account" 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-slate-200",
          "hover:border-primary hover:bg-primary/5"
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <Upload className={cn(
            "w-8 h-8 transition-colors",
            isDragging ? "text-primary" : "text-slate-400"
          )} />
          <p className="text-sm text-slate-600">
            Drag and drop an image here, or
          </p>
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              className="mt-2"
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Browse Files'}
            </Button>
          </label>
          <p className="text-xs text-slate-500 mt-2">
            Maximum file size: 5MB
          </p>
        </div>
      </div>
    </div>
  );
}