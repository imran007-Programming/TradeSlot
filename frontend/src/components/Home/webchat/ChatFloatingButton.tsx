'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MessageSquare, MessageCircle, X } from 'lucide-react';

interface Props {
  onOpenLiveChat: () => void;
}

export default function ChatFloatingButton({ onOpenLiveChat }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801700000000';

  const handleLiveChatClick = () => {
    setIsOpen(false);
    onOpenLiveChat();
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 select-none">
      {/* Expanded Floating Options (Above the main avatar) */}
      {isOpen && (
        <div className="flex flex-col items-end gap-3 animate-fadeIn mb-1">
          {/* WhatsApp Button */}
          <a
            href={`https://wa.me/${whatsappNumber}?text=Hello%20TradeSlot%2C%20I%20need%20assistance%20with%20a%20booking%21`}
            target="_blank"
            rel="noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 bg-white hover:bg-emerald-50 px-3.5 py-2.5 rounded-full shadow-2xl border border-slate-200 hover:border-emerald-300 text-slate-800 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
          >
            <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-700">
              WhatsApp Chat
            </span>
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
              <MessageCircle size={19} />
            </div>
          </a>

          {/* Live Web Chat Button */}
          <button
            onClick={handleLiveChatClick}
            className="flex items-center gap-3 bg-white hover:bg-slate-50 px-3.5 py-2.5 rounded-full shadow-2xl border border-slate-200 text-slate-800 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
          >
            <span className="text-xs font-bold text-slate-700 group-hover:text-[#0F172A]">
              Live Web Chat
            </span>
            <div className="w-10 h-10 rounded-full bg-[#0F172A] text-white flex items-center justify-center shadow-md shadow-slate-900/30">
              <MessageSquare size={18} />
            </div>
          </button>
        </div>
      )}

      {/* Main Floating Trigger Avatar (Clean, no red border) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full bg-white border border-slate-200 shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer p-0.5"
        aria-label="Toggle Chat Options"
      >
        {isOpen ? (
          <div className="w-full h-full rounded-full bg-slate-900 text-white flex items-center justify-center shadow-inner">
            <X size={22} />
          </div>
        ) : (
          <div className="relative w-full h-full rounded-full">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-100">
              <Image
                src="/images.png"
                alt="Support Avatar"
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Green Online Pulse Dot on Top-Left */}
            <span className="absolute -top-0.5 -left-0.5 z-10 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-xs" />
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
