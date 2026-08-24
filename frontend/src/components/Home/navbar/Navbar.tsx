'use client';

import React from 'react';
import Image from 'next/image';
import { MessageSquare } from 'lucide-react';

interface Props {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenChat: () => void;
}

export default function Navbar({ onOpenAuth, onOpenChat }: Props) {
  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/worker.png"
            alt="TradeSlot Logo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain rounded-2xl drop-shadow-sm"
            priority
          />
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A]">
              Trade<span className="text-[#E11D48]">Slot</span>
            </span>
            <span className="hidden sm:block text-[9px] uppercase font-bold tracking-widest text-[#E11D48]">
              • Verified On-Demand Services
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#services" className="hover:text-[#E11D48] transition-colors">
            Services
          </a>
          <a href="#how-it-works" className="hover:text-[#E11D48] transition-colors">
            How It Works
          </a>
          <a href="#schedule-guarantee" className="hover:text-[#E11D48] transition-colors">
            30m Buffer
          </a>
          <a href="#faq" className="hover:text-[#E11D48] transition-colors">
            FAQ
          </a>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAuth('login')}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#E11D48] hover:bg-slate-100 rounded-xl border border-slate-200 transition cursor-pointer"
          >
            Trader Portal
          </button>
          <button
            onClick={onOpenChat}
            className="px-4 sm:px-5 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#E11D48]/25 transition-all hover:scale-102 active:scale-98 flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare size={15} />
            <span>Book a Service</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
