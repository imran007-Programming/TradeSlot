'use client';

import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function ChatHeader({ onClose }: Props) {
  return (
    <div className="bg-[#0F172A] p-4 flex justify-between items-center flex-shrink-0 text-white shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Image
            src="/images.png"
            alt="TradeSlot Avatar"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow-sm"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0F172A] rounded-full" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-white">TradeSlot Direct Chat</h3>
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online • Instant Response
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl w-8 h-8 flex items-center justify-center transition cursor-pointer"
        aria-label="Close Chat"
      >
        <X size={18} />
      </button>
    </div>
  );
}
