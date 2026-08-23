'use client';

import React from 'react';
import Image from 'next/image';
import {
  MessageSquare,
  Sparkles,
  Headphones,
  Star,
  MessageCircle,
  Zap,
  ShieldCheck,
  Car,
  CreditCard,
} from 'lucide-react';
import { CUSTOMER_CARE_HIGHLIGHTS } from '@/data';

interface Props {
  onOpenChat: () => void;
}

const FEATURE_ICONS: Record<number, React.ReactNode> = {
  0: <Zap size={14} />,
  1: <ShieldCheck size={14} />,
  2: <Car size={14} />,
  3: <CreditCard size={14} />,
};

export default function CustomerCareSection({ onOpenChat }: Props) {
  return (
    <section className="py-20 bg-white border-b border-slate-200 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Customer Care Image Card with Floating Badges */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-rose-100 to-amber-100 rounded-3xl blur-2xl opacity-60 -z-10" />

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white w-full max-w-md h-[420px]">
              <Image
                src="/customer_care_man.jpg"
                alt="TradeSlot Customer Support Specialist"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="w-full h-full object-cover object-top hover:scale-102 transition duration-500"
              />

              {/* Floating Top Badge: Online Status */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-slate-200/80 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-bold text-[#0F172A]">Live Support Online</span>
              </div>

              {/* Floating Bottom Card: Customer Trust Pill */}
              <div className="absolute bottom-4 inset-x-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#E11D48] font-bold">
                    <Headphones size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">Dedicated Concierge</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Average Response: &lt; 60s</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-lg flex items-center gap-1">
                  <Star size={11} className="fill-amber-400 text-amber-400" /> 4.9 Rating
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Service Information & Support Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1F2] border border-[#E11D48]/30 text-[#E11D48] text-xs font-bold shadow-xs">
              <Sparkles size={13} />
              <span>24/7 Dedicated Customer Care & Service Assistance</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight leading-tight">
              Need Help Choosing the Right Service or <br className="hidden sm:block" />
              <span className="text-[#E11D48]">Custom Time Slot?</span> We&apos;re Here!
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              Our support team helps you connect directly with certified tradespeople, coordinate emergency callouts, verify pricing estimates, and ensure seamless scheduling with guaranteed 30-minute travel buffers.
            </p>

            {/* Service Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {CUSTOMER_CARE_HIGHLIGHTS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 hover:bg-slate-100/70 transition"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${item.iconBg}`}>
                      {FEATURE_ICONS[idx] || <Zap size={14} />}
                    </div>
                    <h3 className="font-bold text-xs text-[#0F172A]">{item.title}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenChat}
                className="px-6 py-3.5 bg-[#E11D48] hover:bg-[#BE123C] active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#E11D48]/25 transition flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare size={16} />
                <span>Chat with Support Now</span>
              </button>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801700000000'}?text=Hello%20TradeSlot%2C%20I%20need%20assistance%20with%20a%20booking%21`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 transition flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle size={16} className="text-emerald-600" />
                <span>WhatsApp Helpdesk</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
