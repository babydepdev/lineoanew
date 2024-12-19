import React, { useState } from 'react';
import { Image } from 'lucide-react';
import { Dialog, DialogContent } from '../ui/dialog';
import { LineImageContent } from '@/lib/services/line/message/types/imageMessage';

interface ImageMessageProps {
  content: string;
  className?: string;
}

export function ImageMessage({ content, className }: ImageMessageProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  try {
    const imageContent = JSON.parse(content) as LineImageContent;
    
    if (imageContent.type !== 'image' || !imageContent.originalUrl) {
      console.warn('Invalid image content:', imageContent);
      return <span className={className}>[Invalid Image]</span>;
    }

    return (
      <>
        <div 
          className="relative cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setIsOpen(true)}
        >
          <img 
            src={imageContent.previewUrl || imageContent.originalUrl}
            alt="Message"
            className="max-w-[200px] rounded-lg"
            onError={(e) => {
              console.error('Error loading image:', e);
              e.currentTarget.src = imageContent.originalUrl || '';
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
            <Image className="w-6 h-6 text-white" />
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            <img 
              src={imageContent.originalUrl} 
              alt="Full size"
              className="w-full h-full object-contain"
              onError={(e) => {
                console.error('Error loading full size image:', e);
                setIsOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  } catch (error) {
    console.error('Error parsing image content:', error);
    return <span className={className}>[Invalid Image Format]</span>;
  }
}