'use client';

import { useEffect, useState } from 'react';
import { CatAvatar } from './cat-avatar';
import { getLoadingAlicePhrase, getLoadingKsyushaPhrase } from '@/lib/cat-phrases';

export function CatLoading() {
  const [alicePhrase, setAlicePhrase] = useState(getLoadingAlicePhrase());
  const [ksyushaPhrase, setKsyushaPhrase] = useState(getLoadingKsyushaPhrase());

  const pawClassName = 'inline-block text-lg animate-bounce';

  useEffect(() => {
    const aliceInterval = setInterval(() => {
      setAlicePhrase(getLoadingAlicePhrase());
    }, 2500 + Math.random() * 2000);

    const ksyushaInterval = setInterval(() => {
      setKsyushaPhrase(getLoadingKsyushaPhrase());
    }, 3000 + Math.random() * 3000);

    return () => {
      clearInterval(aliceInterval);
      clearInterval(ksyushaInterval);
    };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        {/* Alice */}
        <div className="flex items-center gap-4">
          <div className="relative animate-pulse">
            <CatAvatar name="Алиса" src="/alisa.jpg" size="md" side="left" />
          </div>
          <div className="flex-1 rounded-2xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/40 max-w-xs">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
              🐱 Алиса:
            </p>
            <p className="text-sm text-foreground">{alicePhrase}</p>
            <span className={pawClassName}>🐾</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 sm:justify-end">
        {/* Ksyusha */}
        <div className="flex items-center gap-4 sm:flex-row-reverse">
          <div className="relative animate-pulse">
            <CatAvatar name="Ксюша" src="/ksyusha.jpg" size="md" side="right" />
          </div>
          <div className="flex-1 rounded-2xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/40 max-w-xs">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">
              🐱 Ксюша:
            </p>
            <p className="text-sm text-foreground">{ksyushaPhrase}</p>
            <span className={pawClassName}>🐾</span>
          </div>
        </div>
      </div>

      {/* Loading bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-400 via-amber-400 to-blue-400 rounded-full animate-loading-bar" />
      </div>
    </div>
  );
}