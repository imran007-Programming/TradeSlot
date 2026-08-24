'use client';

import React from 'react';
import Image from 'next/image';

interface Props {
  text?: string;
}

export default function PageLoading({ text = 'Loading data...' }: Props) {
  return (
    <div className="flex-1 w-full h-full min-h-[350px] bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center p-8">
      <div className="text-center space-y-3">
        <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
          <Image
            src="/tools.png"
            alt="Loading..."
            width={48}
            height={48}
            className="w-12 h-12 object-contain animate-bounce drop-shadow-sm"
            priority
          />
        </div>
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-ping" />
          <span>{text}</span>
        </div>
      </div>
    </div>
  );
}
