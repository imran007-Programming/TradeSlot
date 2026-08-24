'use client';

import React from 'react';
import { Search, Plus } from 'lucide-react';

interface Props {
  onCheckSlots: () => void;
  onCreateBooking: () => void;
}

export default function ChatActionBar({ onCheckSlots, onCreateBooking }: Props) {
  return (
    <div className="p-3 border-t border-slate-100 bg-white flex gap-2 flex-shrink-0">
      <button
        onClick={onCheckSlots}
        className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
      >
        <Search size={13} className="text-[#E11D48]" /> Check Slots
      </button>
      <button
        onClick={onCreateBooking}
        className="flex-1 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
      >
        <Plus size={13} /> Create Booking
      </button>
    </div>
  );
}
