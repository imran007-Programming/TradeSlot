'use client';

import React from 'react';
import { Zap } from 'lucide-react';

interface Props {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenChat: () => void;
}

export default function Footer({ onOpenAuth, onOpenChat }: Props) {
  return (
    <footer className="bg-white py-12 text-slate-500 text-xs border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#E11D48] flex items-center justify-center text-white text-xs font-bold">
            <Zap size={13} className="fill-white" />
          </div>
          <p className="font-bold text-[#0F172A]">TradeSlot Platform</p>
          <span className="text-slate-400">© 2026. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6 font-semibold">
          <button
            onClick={() => onOpenAuth('login')}
            className="hover:text-[#E11D48] cursor-pointer"
          >
            Trader Portal
          </button>
          <a href="#services" className="hover:text-[#E11D48]">
            Services
          </a>
          <a href="#how-it-works" className="hover:text-[#E11D48]">
            How It Works
          </a>
          <button onClick={onOpenChat} className="hover:text-[#E11D48] cursor-pointer">
            Live Web Chat
          </button>
        </div>
      </div>
    </footer>
  );
}
