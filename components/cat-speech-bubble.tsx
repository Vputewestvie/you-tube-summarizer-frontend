'use client';

import { CatAvatar } from './cat-avatar';

interface CatSpeechBubbleProps {
  speaker: 'alice' | 'ksyusha';
  text: string;
  className?: string;
}

export function CatSpeechBubble({ speaker, text, className = '' }: CatSpeechBubbleProps) {
  const isAlice = speaker === 'alice';
  const name = isAlice ? 'Алиса' : 'Ксюша';
  const src = isAlice ? '/alisa.jpg' : '/ksyusha.jpg';
  const color = isAlice
    ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40'
    : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40';
  const textColor = isAlice
    ? 'text-blue-700 dark:text-blue-300'
    : 'text-amber-700 dark:text-amber-300';

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <CatAvatar name={name} src={src} size="sm" side={isAlice ? 'left' : 'right'} />
      <div className={`flex-1 rounded-2xl border p-3 ${color}`}>
        <p className={`text-xs font-semibold mb-1 ${textColor}`}>
          🐱 {name}
        </p>
        <p className="text-sm text-foreground">{text}</p>
      </div>
    </div>
  );
}