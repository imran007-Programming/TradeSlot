'use client';

import React from 'react';
import Image from 'next/image';
import { Message } from '@/types';
import { CheckCircle, CalendarDays, Car, CreditCard, ExternalLink, ShieldCheck } from 'lucide-react';

interface Props {
  msg: Message;
}

export default function ChatMessageItem({ msg }: Props) {
  const isCustomer = msg.sender === 'CUSTOMER';

  if (msg.sender === 'SYSTEM') {
    return (
      <div className="flex justify-center">
        <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full font-medium">
          {msg.content}
        </span>
      </div>
    );
  }

  const isBookingCard =
    msg.content.toLowerCase().startsWith('booking confirmed:') ||
    msg.content.toLowerCase().startsWith('booking offer:');

  const paymentUrlMatch = msg.content.match(/(https?:\/\/[^\s]+)/)?.[0];
  const isPaymentCard =
    (msg.content.toLowerCase().includes('payment link') ||
      msg.content.toLowerCase().includes('stripe.com')) &&
    !!paymentUrlMatch;

  return (
    <div className={`flex items-end gap-2 ${isCustomer ? 'justify-start' : 'justify-end'}`}>
      {isCustomer && (
        <Image
          src="/images.png"
          alt="Customer"
          width={24}
          height={24}
          className="w-6 h-6 rounded-full object-cover border border-slate-200 shadow-xs flex-shrink-0 mb-0.5"
        />
      )}

      {/* 1. Booking Offer / Confirmed Card */}
      {isBookingCard ? (
        (() => {
          const content = msg.content;
          const isConfirmed = content.toLowerCase().startsWith('booking confirmed:');
          const feeMatch = content.match(/Fee:\s*\$([\d.]+)/i);
          const fee = feeMatch ? feeMatch[1] : '50';
          const timeMatch = content.match(
            /\((\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))\)/i
          );
          const timeStr = timeMatch ? timeMatch[1] : null;

          const cleaned = content
            .replace(/Booking (Offer|Proposed|Confirmed):\s*/i, '')
            .replace(/\(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\)/i, '')
            .replace(/\(Fee:\s*\$[\d.]+\)/i, '')
            .replace(/\[ID:\s*[a-zA-Z0-9_-]+\]/i, '')
            .trim();

          const dateStr = cleaned || 'Scheduled Date';

          return (
            <div className="max-w-sm rounded-2xl overflow-hidden bg-white shadow-lg border border-slate-100 text-[#0F172A]">
              <div
                className={`px-3.5 py-2 text-white flex items-center justify-between ${
                  isConfirmed
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
                    : 'bg-gradient-to-r from-[#E11D48] to-[#BE123C]'
                }`}
              >
                <span className="font-bold text-xs flex items-center gap-1.5">
                  {isConfirmed ? <CheckCircle size={14} /> : <CalendarDays size={14} />}
                  <span>{isConfirmed ? 'Booking Confirmed' : 'Booking Offer'}</span>
                </span>
                <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-white">
                  {isConfirmed ? 'Confirmed' : 'Pending'}
                </span>
              </div>
              <div className="p-3.5 space-y-2 text-xs bg-white">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <span className="font-bold text-slate-400 text-[11px]">Date:</span>
                    <span className="font-bold text-[#0F172A]">{dateStr}</span>
                  </div>
                  {timeStr && (
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <span className="font-bold text-slate-400 text-[11px]">Time:</span>
                      <span className="font-bold text-[#E11D48]">{timeStr}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <span className="font-bold text-slate-400 text-[11px]">Fee:</span>
                    <span className="font-bold text-slate-900">${fee}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-xl">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Car size={13} className="text-slate-500" />
                    <span>Travel Buffer (30m):</span>
                  </span>
                  <span className="font-bold text-emerald-600">Applied</span>
                </div>
              </div>
            </div>
          );
        })()
      ) : isPaymentCard && paymentUrlMatch ? (
        /* 2. Stripe Checkout Link Card */
        <div className="max-w-sm rounded-2xl overflow-hidden bg-white shadow-lg border border-slate-100 text-[#0F172A]">
          <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] px-3.5 py-2 text-white flex items-center justify-between">
            <span className="font-bold text-xs flex items-center gap-1.5">
              <CreditCard size={14} className="text-[#E11D48]" />
              <span>Stripe Payment Link Sent</span>
            </span>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Active
            </span>
          </div>
          <div className="p-3.5 space-y-2.5 bg-white text-xs">
            <p className="text-slate-600 leading-relaxed font-medium">
              Direct payment link sent to customer.
            </p>
            <a
              href={paymentUrlMatch}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 bg-[#E11D48] hover:bg-[#BE123C] active:scale-98 text-white font-bold rounded-xl shadow-xs transition text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Open Stripe Checkout</span>
              <ExternalLink size={13} />
            </a>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <ShieldCheck size={13} className="text-emerald-500" /> Stripe Protected
              </span>
              <span className="font-mono text-[9px] text-slate-400">100% Encrypted</span>
            </div>
          </div>
        </div>
      ) : (
        /* 3. Regular Chat Bubble */
        <div
          className={`max-w-sm px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
            isCustomer
              ? 'bg-white border border-slate-200 text-[#0F172A] rounded-bl-none shadow-xs'
              : 'bg-[#E11D48] text-white rounded-br-none shadow-xs'
          }`}
        >
          <p className="whitespace-pre-wrap">{msg.content}</p>
          {msg.sentAt && (
            <span className="text-[9px] opacity-60 block text-right mt-1">
              {new Date(msg.sentAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          )}
        </div>
      )}

      {!isCustomer && (
        <div className="w-6 h-6 rounded-full bg-[#BE123C] text-white flex items-center justify-center text-[9px] font-bold shadow-xs flex-shrink-0 mb-0.5">
          You
        </div>
      )}
    </div>
  );
}
