import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus } from 'lucide-react';
import { Button } from '../../ui/button';
import { showToast } from '@/app/utils/toast';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string | null;
}

export function ImageUpload({ onUpload, currentImage }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

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

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onUpload={(result: any) => {
          setIsUploading(false);
          if (result.event !== "success") return;
          
          const url = result.info.secure_url;
          onUpload(url);
          showToast.success('Image uploaded successfully');
        }}
        options={{
          maxFiles: 1,
          resourceType: "image",
          folder: "line-accounts",
        }}
      >
        {({ open }) => (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsUploading(true);
              open();
            }}
            disabled={isUploading}
            className="w-full sm:w-auto"
          >
            <ImagePlus className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
}