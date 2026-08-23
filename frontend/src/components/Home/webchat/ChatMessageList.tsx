'use client';

import React, { RefObject } from 'react';
import Image from 'next/image';
import { WebChatMessage } from '@/types/home';
import BookingProposalCard from './BookingProposalCard';
import PaymentLinkCard from './PaymentLinkCard';

interface Props {
  messages: WebChatMessage[];
  loading: boolean;
  error: string;
  confirmedBookingIds: string[];
  confirmingBookingId: string | null;
  bottomRef: RefObject<HTMLDivElement | null>;
  onAcceptBooking: (bookingId: string | null) => void;
  onRejectBooking: () => void;
}

export function extractUrl(text: string): string | null {
  return text.match(/(https?:\/\/[^\s]+)/)?.[0] || null;
}

export function isBookingOffer(text: string): boolean {
  return text.toLowerCase().startsWith('booking offer:') || text.toLowerCase().startsWith('booking proposed:');
}

export function isBookingConfirmed(text: string): boolean {
  return text.toLowerCase().startsWith('booking confirmed:');
}

export function isBookingRelated(text: string): boolean {
  return isBookingOffer(text) || isBookingConfirmed(text);
}

export default function ChatMessageList({
  messages,
  loading,
  error,
  confirmedBookingIds,
  confirmingBookingId,
  bottomRef,
  onAcceptBooking,
  onRejectBooking,
}: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
      {messages.length === 0 && (
        <div className="text-center text-slate-400 text-xs pt-6">
          Connecting to direct session...
        </div>
      )}

      {messages.map((msg) => {
        const isCustomer = msg.sender === 'CUSTOMER';
        const url = extractUrl(msg.content);
        const isPayment = (msg.content.toLowerCase().includes('payment link') || msg.content.toLowerCase().includes('stripe.com')) && !!url;
        const isCard = isBookingRelated(msg.content) || isPayment;

        return (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${isCustomer ? 'justify-end' : 'justify-start'}`}
          >
            {!isCustomer && !isCard && (
              <Image
                src="/images.png"
                alt="Trader Avatar"
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-cover border border-slate-200 shadow-xs flex-shrink-0 mb-0.5"
              />
            )}
            <div
              className={`max-w-[88%] break-words text-xs leading-relaxed ${
                isCard
                  ? 'bg-transparent text-[#0F172A] p-0 overflow-hidden shadow-none border-0'
                  : isCustomer
                  ? 'px-4 py-3 rounded-2xl shadow-xs bg-[#E11D48] text-white rounded-br-none'
                  : 'px-4 py-3 rounded-2xl shadow-xs bg-white border border-slate-200 text-[#0F172A] rounded-bl-none'
              }`}
            >
              {isBookingRelated(msg.content) ? (
                <BookingProposalCard
                  content={msg.content}
                  confirmedBookingIds={confirmedBookingIds}
                  confirmingBookingId={confirmingBookingId}
                  onAccept={onAcceptBooking}
                  onReject={onRejectBooking}
                />
              ) : isPayment && url ? (
                <PaymentLinkCard url={url} />
              ) : (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              )}

              {msg.sentAt && !isCard && (
                <span
                  className={`text-[9px] block text-right mt-1 ${
                    isCustomer ? 'text-white/80' : 'text-slate-400'
                  }`}
                >
                  {new Date(msg.sentAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {loading && (
        <div className="flex justify-end">
          <div className="bg-[#FFF1F2] border border-[#E11D48] px-4 py-2.5 rounded-2xl rounded-br-none flex space-x-1.5">
            <div className="w-1.5 h-1.5 bg-[#E11D48] rounded-full animate-bounce" />
            <div
              className="w-1.5 h-1.5 bg-[#E11D48] rounded-full animate-bounce"
              style={{ animationDelay: '0.15s' }}
            />
            <div
              className="w-1.5 h-1.5 bg-[#E11D48] rounded-full animate-bounce"
              style={{ animationDelay: '0.3s' }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="flex justify-center">
          <p className="text-[10px] text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl font-medium">
            {error}
          </p>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
