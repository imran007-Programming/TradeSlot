'use client';

import React from 'react';
import { ExternalLink, CreditCard, ShieldCheck } from 'lucide-react';

interface Props {
  url: string;
}

export default function PaymentLinkCard({ url }: Props) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-lg border border-slate-100 text-[#0F172A]">
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] px-3.5 py-2.5 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard size={15} className="text-[#E11D48]" />
          <p className="font-bold text-xs tracking-tight">
            Stripe Payment Link
          </p>
        </div>
        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Secure
        </span>
      </div>
      <div className="p-3.5 space-y-3 bg-white">
        <p className="text-slate-600 text-xs leading-relaxed font-medium">
          Please complete your deposit/fee payment to finalize your appointment.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-3 bg-[#E11D48] hover:bg-[#BE123C] active:scale-98 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer text-center"
        >
          <CreditCard size={14} />
          <span>Complete Payment on Stripe</span>
          <ExternalLink size={12} />
        </a>
        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
          <span className="flex items-center gap-1.5 text-slate-500 font-medium">
            <ShieldCheck size={13} className="text-emerald-500" /> Stripe Protected
          </span>
          <span className="font-mono text-[9px] text-slate-400">
            100% Encrypted
          </span>
        </div>
      </div>
    </div>
  );
}
