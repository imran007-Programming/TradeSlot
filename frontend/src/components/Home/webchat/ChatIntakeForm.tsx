'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { User, Phone, MapPin, ArrowRight, ChevronRight, AlertCircle, PenLine, Lock, Sparkles } from 'lucide-react';
import { QuickPrompt } from '@/types/home';
import { QUICK_PROMPTS } from '@/data';

interface Props {
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  selectedPrompt: QuickPrompt | null;
  setSelectedPrompt: (prompt: QuickPrompt | null) => void;
  error: string;
  onStart: () => void;
}

export default function ChatIntakeForm({
  name,
  setName,
  phone,
  setPhone,
  location,
  setLocation,
  selectedPrompt,
  setSelectedPrompt,
  error,
  onStart,
}: Props) {
  const [customPromptText, setCustomPromptText] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSelectPrompt = (prompt: QuickPrompt) => {
    setSelectedPrompt(prompt);
    setShowCustomInput(false);
  };

  const handleCustomSubmit = () => {
    if (!customPromptText.trim()) return;
    setSelectedPrompt({
      id: 'custom',
      label: customPromptText,
      icon: '✍️',
      desc: 'Custom message',
      defaultMsg: customPromptText,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 flex flex-col justify-between">
      {/* Welcome greeting card */}
      <div className="space-y-3">
        <div className="flex items-start gap-2.5">
          <Image
            src="/images.png"
            alt="Avatar"
            width={28}
            height={28}
            className="w-7 h-7 rounded-full object-cover border border-slate-200 shadow-xs mt-0.5 flex-shrink-0"
          />
          <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-none shadow-xs text-xs text-slate-700 space-y-1">
            <p className="font-bold text-[#0F172A] flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#E11D48]" />
              <span>Hello! Welcome to TradeSlot.</span>
            </p>
            <p className="text-slate-500 font-medium">
              Select how we can help you, or tap a quick message below:
            </p>
          </div>
        </div>

        {/* Step 1: Quick Prompt Chips / Selection */}
        {!selectedPrompt ? (
          <div className="space-y-2 pt-1">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
              Choose a topic:
            </p>

            <div className="space-y-2">
              {QUICK_PROMPTS.map((qp) => (
                <button
                  key={qp.id}
                  type="button"
                  onClick={() => handleSelectPrompt(qp)}
                  className="w-full p-3 rounded-2xl border border-slate-200 bg-white hover:border-[#E11D48] hover:bg-[#FFF1F2] transition-all text-left shadow-2xs group cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl p-2 rounded-xl bg-slate-50 group-hover:bg-white border border-slate-100 flex-shrink-0">
                      {qp.icon}
                    </span>
                    <div>
                      <p className="font-bold text-xs text-[#0F172A] group-hover:text-[#E11D48] transition-colors">
                        {qp.label}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">{qp.desc}</p>
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-slate-400 group-hover:text-[#E11D48] transition-colors"
                  />
                </button>
              ))}
            </div>

            {/* Custom input toggle */}
            {!showCustomInput ? (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="w-full text-center py-2 text-xs font-semibold text-slate-500 hover:text-[#E11D48] transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <PenLine size={13} />
                <span>Or type a custom inquiry...</span>
              </button>
            ) : (
              <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-2 animate-fadeIn">
                <input
                  type="text"
                  placeholder="Type your question or request..."
                  value={customPromptText}
                  onChange={(e) => setCustomPromptText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#E11D48]"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(false)}
                    className="px-2.5 py-1 text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCustomSubmit}
                    disabled={!customPromptText.trim()}
                    className="px-3 py-1 bg-[#E11D48] text-white rounded-xl text-[11px] font-bold disabled:opacity-50 cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Step 2: Intake Details (Name & Phone) */
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-rose-50 text-[#E11D48]">
                  <Sparkles size={14} />
                </span>
                <span className="text-xs font-bold text-[#0F172A]">
                  {selectedPrompt.label}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPrompt(null)}
                className="text-[10px] font-bold text-slate-500 hover:text-[#E11D48] underline ml-2 flex-shrink-0 cursor-pointer"
              >
                Change
              </button>
            </div>

            {error && (
              <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-xl font-medium flex items-center gap-2">
                <AlertCircle size={14} className="text-red-600 flex-shrink-0" />
                <span>{error}</span>
              </p>
            )}

            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="e.g. 07123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Your Location / Postcode
                </label>
                <div className="relative">
                  <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E11D48]" />
                  <input
                    type="text"
                    placeholder="e.g. Camden, North London or Postcode"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onStart}
              className="w-full py-2.5 bg-[#E11D48] hover:bg-[#BE123C] active:scale-98 text-white font-bold rounded-xl text-xs shadow-md shadow-[#E11D48]/20 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Start Chat Session</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="text-center pt-2">
        <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
          <Lock size={11} className="text-slate-400" />
          <span>Fast &amp; direct connection • No spam guaranteed</span>
        </p>
      </div>
    </div>
  );
}
