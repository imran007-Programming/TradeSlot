'use client';

import React from 'react';
import { Calendar, CheckCircle2, Car, ShieldCheck, Check, RotateCcw } from 'lucide-react';

interface Props {
  content: string;
  confirmedBookingIds: string[];
  confirmingBookingId: string | null;
  onAccept: (bookingId: string | null) => void;
  onReject: () => void;
}

export function parseBookingData(text: string) {
  const feeMatch = text.match(/Fee:\s*\$([\d.]+)/i);
  const idMatch = text.match(/\[ID:\s*([a-zA-Z0-9_-]+)\]/i);
  const timeMatch = text.match(/\((\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))\)/i);
  const timeStr = timeMatch ? timeMatch[1] : null;

  const cleaned = text
    .replace(/Booking (Offer|Proposed|Confirmed):\s*/i, '')
    .replace(/\(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\)/i, '')
    .replace(/\(Fee:\s*\$[\d.]+\)/i, '')
    .replace(/\[ID:\s*[a-zA-Z0-9_-]+\]/i, '')
    .trim();

  return {
    date: cleaned || 'Scheduled Date',
    time: timeStr,
    fee: feeMatch ? feeMatch[1] : '50.00',
    bookingId: idMatch ? idMatch[1] : null,
  };
}

export default function BookingProposalCard({
  content,
  confirmedBookingIds,
  confirmingBookingId,
  onAccept,
  onReject,
}: Props) {
  const b = parseBookingData(content);
  const isExplicitlyConfirmed = content.toLowerCase().startsWith('booking confirmed:');
  const isConfirmed = isExplicitlyConfirmed || (b.bookingId && confirmedBookingIds.includes(b.bookingId));

  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-lg border border-slate-100 text-[#0F172A]">
      {/* Header Ribbon */}
      <div
        className={`px-4 py-2.5 text-white flex items-center justify-between ${
          isConfirmed
            ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
            : 'bg-gradient-to-r from-[#E11D48] to-[#BE123C]'
        }`}
      >
        <div className="flex items-center gap-2">
          {isConfirmed ? <CheckCircle2 size={16} /> : <Calendar size={16} />}
          <p className="font-bold text-xs tracking-tight">
            {isConfirmed ? 'Booking Confirmed!' : 'Booking Slot Proposed'}
          </p>
        </div>
        <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-white">
          {isConfirmed ? 'Confirmed' : 'Action Required'}
        </span>
      </div>

      {/* Card Details */}
      <div className="p-3.5 space-y-3 bg-white">
        {/* Slot Row */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="font-bold text-slate-400 text-[11px]">Date:</span>
            <span className="font-bold text-[#0F172A]">{b.date}</span>
          </div>
          {b.time && (
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="font-bold text-slate-400 text-[11px]">Time:</span>
              <span className="font-bold text-[#E11D48]">{b.time}</span>
            </div>
          )}
        </div>

        {/* Travel buffer indicator */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-xl text-[11px]">
          <span className="text-slate-600 font-medium flex items-center gap-1.5">
            <Car size={13} className="text-slate-500" />
            <span>30m Travel Buffer:</span>
          </span>
          <span className="font-bold text-emerald-600 flex items-center gap-1">
            <Check size={12} className="stroke-[3]" /> Applied
          </span>
        </div>

        {/* Fee & Escrow row */}
        <div className="pt-2 border-t border-dashed border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Booking Fee</span>
            <span className="text-sm font-black text-[#0F172A]">${b.fee}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
            <ShieldCheck size={12} /> Stripe Protected
          </span>
        </div>

        {/* Action Buttons for Customer Confirmation */}
        {!isConfirmed ? (
          <div className="pt-1 space-y-2">
            <button
              type="button"
              disabled={confirmingBookingId === b.bookingId}
              onClick={() => onAccept(b.bookingId)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-60"
            >
              <Check size={14} className="stroke-[3]" />
              <span>{confirmingBookingId === b.bookingId ? 'Confirming...' : 'Yes, Confirm This Slot'}</span>
            </button>
            <button
              type="button"
              onClick={onReject}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-[11px] transition cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={12} />
              <span>Request Another Time</span>
            </button>
          </div>
        ) : (
          <div className="pt-1 bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-center text-emerald-800 text-[11px] font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>You have confirmed this appointment!</span>
          </div>
        )}
      </div>
    </div>
  );
}
