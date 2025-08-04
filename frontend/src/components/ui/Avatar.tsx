import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  src?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  name, 
  src, 
  color, 
  size = 'md',
  className 
}) => {
  // Generate color from name if not provided
  const getColorFromName = (name: string): { bg: string; path: string } => {
    const colorPairs = [
      { bg: '#EADDFF', path: '#4F378A' }, // Purple (original)
      { bg: '#E3F2FD', path: '#1976D2' }, // Blue
      { bg: '#E8F5E8', path: '#2E7D32' }, // Green
      { bg: '#FFF3E0', path: '#F57C00' }, // Orange
      { bg: '#FCE4EC', path: '#C2185B' }, // Pink
      { bg: '#F3E5F5', path: '#7B1FA2' }, // Deep Purple
      { bg: '#E0F2F1', path: '#00695C' }, // Teal
      { bg: '#FFF8E1', path: '#F9A825' }, // Amber
    ];
    
    // Simple hash function to get consistent color for same name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colorPairs[Math.abs(hash) % colorPairs.length];
  };

  // Generate colored SVG avatar
  const getColoredAvatar = (name: string): string => {
    const colors = getColorFromName(name);
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="84" height="84" rx="42" fill="${colors.bg}"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M54.6005 33.6C54.6005 40.5588 48.9593 46.2 42.0005 46.2C35.0417 46.2 29.4005 40.5588 29.4005 33.6C29.4005 26.6412 35.0417 21 42.0005 21C48.9593 21 54.6005 26.6412 54.6005 33.6ZM50.4005 33.6C50.4005 38.2392 46.6397 42 42.0005 42C37.3613 42 33.6005 38.2392 33.6005 33.6C33.6005 28.9608 37.3613 25.2 42.0005 25.2C46.6397 25.2 50.4005 28.9608 50.4005 33.6Z" fill="${colors.path}"/>
        <path d="M42.0005 52.5C28.4043 52.5 16.82 60.5397 12.4072 71.8033C13.4822 72.8708 14.6146 73.8804 15.7994 74.8273C19.0854 64.4862 29.3936 56.7 42.0005 56.7C54.6074 56.7 64.9157 64.4862 68.2016 74.8274C69.3864 73.8805 70.5188 72.8708 71.5938 71.8033C67.1811 60.5397 55.5967 52.5 42.0005 52.5Z" fill="${colors.path}"/>
      </svg>
    `)}`;
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-32 h-32'
  };

  const avatarSrc = src || getColoredAvatar(name);

  return (
    <div className={cn(
      'relative rounded-full overflow-hidden flex items-center justify-center',
      sizeClasses[size],
      className
    )}>
      <img
        src={avatarSrc}
        alt={`${name} avatar`}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Avatar; 