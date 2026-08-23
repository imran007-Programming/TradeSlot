'use client';

import React from 'react';
import { HOW_IT_WORKS_STEPS } from '@/data';

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E11D48] bg-[#FFF1F2] px-3 py-1 rounded-full border border-[#E11D48]/30">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A]">
            How TradeSlot Intelligent Booking Works
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Zero phone tag. Real-time slot allocation with verified travel buffers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div
              key={step.num}
              className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3 shadow-xs relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] text-[#E11D48] font-bold text-xl flex items-center justify-center border border-[#E11D48]/20">
                {step.num}
              </div>
              <h3 className="font-bold text-[#0F172A] text-base">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
