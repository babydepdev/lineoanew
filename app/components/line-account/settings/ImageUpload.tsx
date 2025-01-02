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

  const handleUpload = (result: any) => {
    setIsUploading(false);
    
    if (!result.info || result.event !== "success") {
      return;
    }

    const url = result.info.secure_url;
    onUpload(url);
    showToast.success('Image uploaded successfully');
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

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onUpload={handleUpload}
        options={{
          maxFiles: 1,
          sources: ["local", "url", "camera"],
          resourceType: "image",
          clientAllowedFormats: ["jpg", "jpeg", "png", "gif"],
          maxFileSize: 5000000,
          showAdvancedOptions: false,
          multiple: false,
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#90A0B3",
              tabIcon: "#0078FF",
              menuIcons: "#5A616A",
              textDark: "#000000",
              textLight: "#FFFFFF",
              link: "#0078FF",
              action: "#FF620C",
              inactiveTabIcon: "#0E2F5A",
              error: "#F44235",
              inProgress: "#0078FF",
              complete: "#20B832",
              sourceBg: "#E4EBF1"
            }
          }
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