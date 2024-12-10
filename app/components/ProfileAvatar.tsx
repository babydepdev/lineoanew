import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { useLineProfile } from '../hooks/useLineProfile';
import { Platform } from '@prisma/client';
import { cn } from '@/lib/utils';

interface ProfileAvatarProps {
  userId: string;
  platform: Platform;
  className?: string;
}

export function ProfileAvatar({ userId, platform, className }: ProfileAvatarProps) {
  const { profile } = useLineProfile(platform === 'LINE' ? userId : null);

  return (
    <Avatar className={cn("h-8 w-8 shrink-0", className)}>
      {profile?.pictureUrl ? (
        <AvatarImage src={profile.pictureUrl} alt={profile.displayName || 'User'} />
      ) : (
        <AvatarFallback className={cn(
          platform === 'LINE' ? "bg-primary text-primary-foreground" : "bg-muted/10 text-muted"
        )}>
          {platform === 'LINE' ? 'L' : 'F'}
        </AvatarFallback>
      )}
    </Avatar>
  );
}