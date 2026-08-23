'use client';

import React from 'react';
import { MessageSquare, ArrowRight, Car, CheckCircle2, ShieldCheck, Check } from 'lucide-react';

interface Props {
  onOpenChat: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export default function BufferGuaranteeSection({ onOpenChat, onOpenAuth }: Props) {
  return (
    <section id="schedule-guarantee" className="py-20 bg-slate-900 relative overflow-hidden border-b border-slate-800 text-white">
      {/* Ambient Gradient Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-[#E11D48]/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E11D48]/20 border border-[#E11D48]/40 text-[#E11D48] text-xs font-bold shadow-xs">
            <Car size={14} />
            <span className="uppercase tracking-wider">Smart Travel Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Why the <span className="text-[#E11D48]">30-Minute Travel Buffer</span> <br className="hidden sm:block" />
            Changes Everything
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            Traditional booking platforms schedule back-to-back jobs, causing late arrivals, traffic stress, and cancellations. TradeSlot calculates a realistic 30-minute travel window between every single job for 100% on-time arrivals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Visual Roadmap / Timeline Simulation */}
          <div className="lg:col-span-6 bg-slate-950/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-bold text-slate-200">Live Schedule Progression</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#E11D48] bg-[#E11D48]/10 border border-[#E11D48]/20 px-2 py-0.5 rounded-full">
                Buffer Enforced
              </span>
            </div>

            {/* Timeline Steps */}
            <div className="space-y-3 pt-1">
              {/* Job 1 */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">09:00 AM – 10:00 AM</p>
                    <p className="text-[11px] text-slate-400">Customer in Camden • Electrical Repair</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2 py-1 rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-400" /> Completed
                </span>
              </div>

              {/* Buffer Connector 1 */}
              <div className="mx-6 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-950/40 via-emerald-900/30 to-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                <span className="flex items-center gap-2 font-bold text-[11px]">
                  <Car size={14} className="text-emerald-400" />
                  <span>30m Travel &amp; Transit Buffer</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">10:00 – 10:30 AM</span>
              </div>

              {/* Job 2 */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#E11D48]/20 text-[#E11D48] border border-[#E11D48]/30 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">10:30 AM – 11:30 AM</p>
                    <p className="text-[11px] text-slate-400">Customer in Islington • Boiler Checkup</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2 py-1 rounded-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> On-Time Arrival
                </span>
              </div>

              {/* Buffer Connector 2 */}
              <div className="mx-6 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-950/40 via-emerald-900/30 to-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                <span className="flex items-center gap-2 font-bold text-[11px]">
                  <Car size={14} className="text-emerald-400" />
                  <span>30m Travel &amp; Transit Buffer</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">11:30 – 12:00 PM</span>
              </div>

              {/* Job 3 */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">12:00 PM – 01:00 PM</p>
                    <p className="text-[11px] text-slate-400">Customer in Westminster • Plumbing</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded-lg">
                  Upcoming Slot
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Key Benefits & Action Box */}
          <div className="lg:col-span-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-1">
                <p className="text-2xl font-black text-[#E11D48]">0%</p>
                <p className="text-xs font-bold text-white">Schedule Clashes</p>
                <p className="text-[10px] text-slate-400">Overlapping jobs are prevented by algorithm.</p>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-1">
                <p className="text-2xl font-black text-emerald-400">99.8%</p>
                <p className="text-xs font-bold text-white">On-Time Arrival</p>
                <p className="text-[10px] text-slate-400">Trades reach your doorstep on schedule.</p>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-1">
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-xs font-bold text-white">Stripe Escrow</p>
                <p className="text-[10px] text-slate-400">Funds secured until job is verified.</p>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Guaranteed Service Standards</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check size={13} className="text-emerald-400 font-bold stroke-[3] flex-shrink-0" />
                  <span>No rushed work — traders have full preparation time between locations.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={13} className="text-emerald-400 font-bold stroke-[3] flex-shrink-0" />
                  <span>Automatic route optimization based on trader coverage zones.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={13} className="text-emerald-400 font-bold stroke-[3] flex-shrink-0" />
                  <span>Direct SMS/WhatsApp appointment updates when the pro is en route.</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={onOpenChat}
                className="w-full sm:w-auto flex-1 py-4 px-6 bg-[#E11D48] hover:bg-[#BE123C] active:scale-98 text-white font-bold rounded-2xl shadow-xl shadow-[#E11D48]/25 transition text-center cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} />
                <span>Book with Guaranteed Buffer</span>
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto py-4 px-5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-2xl border border-slate-700 transition text-center cursor-pointer text-xs flex items-center justify-center gap-1.5"
              >
                <span>Join as Registered Trader</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
