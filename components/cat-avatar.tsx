'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CatAvatarProps {
  name: string;
  src: string;
  size?: 'sm' | 'md' | 'lg';
  side?: 'left' | 'right';
}

export function CatAvatar({ name, src, size = 'md', side = 'left' }: CatAvatarProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isTilting, setIsTilting] = useState(false);

  const sizeMap = {
    sm: 64,
    md: 96,
    lg: 128,
  };

  const pixelSize = sizeMap[size];

  // Random blink
  useState(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(blinkInterval);
  });

  return (
    <div
      className={`relative flex flex-col items-center gap-2 group ${
        side === 'right' ? 'flex-col-reverse' : ''
      }`}
      onMouseEnter={() => setIsTilting(true)}
      onMouseLeave={() => setIsTilting(false)}
    >
      <div
        className={`
          relative rounded-full overflow-hidden
          shadow-lg ring-2 ring-primary/20
          transition-all duration-300 ease-out
          ${isTilting ? (side === 'left' ? 'rotate-[-8deg]' : 'rotate-[8deg]') : 'rotate-0'}
          ${isBlinking ? 'scale-y-[0.05] scale-x-100' : 'scale-100'}
        `}
        style={{ width: pixelSize, height: pixelSize }}
      >
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover"
          sizes={`${pixelSize}px`}
          priority
        />
      </div>
      {/* Ear animation - subtle */}
      <div
        className={`
          absolute -top-1 w-3 h-3 rounded-full bg-primary/10
          transition-transform duration-200
          ${side === 'left' ? '-left-0.5' : '-right-0.5'}
          ${isTilting ? 'scale-110' : 'scale-100'}
        `}
      />
      <span className="text-xs font-medium text-muted-foreground">{name}</span>
    </div>
  );
}