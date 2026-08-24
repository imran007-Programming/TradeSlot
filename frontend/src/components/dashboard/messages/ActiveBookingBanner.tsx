'use client';

import React from 'react';
import { Conversation } from '@/types';
import { CheckCircle, Clock, CreditCard } from 'lucide-react';

interface Props {
  conversation: Conversation;
  generatingPayment: string | null;
  onGeneratePaymentLink: (bookingId: string) => void;
  onChangeSlot: () => void;
}

export default function ActiveBookingBanner({
  conversation,
  generatingPayment,
  onGeneratePaymentLink,
  onChangeSlot,
}: Props) {
  const activeBookings = (conversation.bookings || []).filter((b) => b.status !== 'CANCELLED');
  if (activeBookings.length === 0) return null;

  const confirmedBooking = activeBookings.find(
    (b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED'
  );
  const pendingBooking = activeBookings.find((b) => b.status === 'PENDING');

  if (confirmedBooking) {
    const isPaid = confirmedBooking.payment?.status === 'SUCCEEDED';
    return (
      <div className="bg-emerald-50/60 border-b border-emerald-200/80 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0 font-bold">
              <CheckCircle size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-[#0F172A] truncate">
                  Confirmed:{' '}
                  {new Date(confirmedBooking.slotStart).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {confirmedBooking.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {new Date(confirmedBooking.slotStart).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                –{' '}
                {new Date(confirmedBooking.slotEnd).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                • Fee: <strong className="text-slate-800">${confirmedBooking.bookingFee}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isPaid ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-xs">
                <CheckCircle size={13} className="text-emerald-600" /> Paid
              </span>
            ) : (
              <button
                onClick={() => onGeneratePaymentLink(confirmedBooking.id)}
                disabled={generatingPayment === confirmedBooking.id}
                className="bg-[#0F172A] hover:bg-[#1E293B] active:scale-98 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition disabled:opacity-50 flex items-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer"
              >
                <CreditCard size={13} />
                <span>
                  {generatingPayment === confirmedBooking.id ? 'Generating...' : 'Send Stripe Link'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (pendingBooking) {
    return (
      <div className="bg-amber-50/70 border-b border-amber-200/80 px-4 py-2.5 flex-shrink-0">
        <div className="flex items-center justify-between text-xs text-amber-900 bg-white px-3 py-2 rounded-xl border border-amber-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-amber-600" />
            <span className="font-semibold">
              Slot Proposed:{' '}
              {new Date(pendingBooking.slotStart).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              })}{' '}
              (
              {new Date(pendingBooking.slotStart).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              -{' '}
              {new Date(pendingBooking.slotEnd).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
              )
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
              Awaiting Customer
            </span>
          </div>
          <button
            onClick={onChangeSlot}
            className="text-[11px] font-bold text-[#E11D48] hover:underline cursor-pointer ml-2"
          >
            Change Slot
          </button>
        </div>
      </div>
    );
  }

  return null;
}
