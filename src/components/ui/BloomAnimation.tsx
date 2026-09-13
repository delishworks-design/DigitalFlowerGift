'use client';

import { useState, useEffect } from 'react';

interface BloomAnimationProps {
  onComplete?: () => void;
}

export default function BloomAnimation({ onComplete }: BloomAnimationProps) {
  const [phase, setPhase] = useState<'growing' | 'blooming' | 'revealed'>('growing');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('blooming'), 1200);
    const t2 = setTimeout(() => setPhase('revealed'), 2800);
    const t3 = setTimeout(() => onComplete?.(), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div className="relative w-64 h-64 mx-auto" aria-hidden="true">
      {/* Growing Phase */}
      {phase === 'growing' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-sage rounded-full animate-pulse" />
        </div>
      )}

      {/* Blooming Phase */}
      {phase === 'blooming' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-16 h-24 bg-rose/80 rounded-full origin-bottom"
              style={{
                transform: `rotate(${i * 60}deg) translateY(-20px)`,
                animation: `petalOpen 0.8s ease-out ${i * 0.1}s both`,
              }}
            />
          ))}
          <div className="absolute w-6 h-6 bg-warm-gold rounded-full z-10" />
        </div>
      )}

      {/* Revealed Phase */}
      {phase === 'revealed' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-16 h-24 bg-rose/80 rounded-full origin-bottom"
              style={{
                transform: `rotate(${i * 60}deg) translateY(-20px)`,
              }}
            />
          ))}
          <div className="absolute w-6 h-6 bg-warm-gold rounded-full z-10" />
          {/* Sparkle particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute w-1.5 h-1.5 bg-warm-gold rounded-full animate-ping"
              style={{
                left: `${30 + Math.random() * 40}%`,
                top: `${30 + Math.random() * 40}%`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
