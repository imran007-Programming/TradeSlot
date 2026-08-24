'use client';

import React from 'react';
import { DatePicker } from '@/components/ui/date-picker';
import { Conversation } from '@/types';

interface Props {
  selectedConversation: Conversation | null;
  bookingDate: string;
  onBookingDateChange: (date: string) => void;
  startTime: string;
  onStartTimeChange: (time: string) => void;
  endTime: string;
  onEndTimeChange: (time: string) => void;
  bookingFee: string;
  onBookingFeeChange: (fee: string) => void;
  bookingError: string;
  creatingBooking: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function CreateBookingModal({
  selectedConversation,
  bookingDate,
  onBookingDateChange,
  startTime,
  onStartTimeChange,
  endTime,
  onEndTimeChange,
  bookingFee,
  onBookingFeeChange,
  bookingError,
  creatingBooking,
  onSubmit,
  onClose,
}: Props) {
  const inputCls =
    'w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-[#0F172A]">
        <h3 className="text-base font-bold text-[#0F172A]">
          Create Booking {selectedConversation ? 'for ' + selectedConversation.customer.name : ''}
        </h3>
        {bookingError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl">
            {bookingError}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Booking Date</label>
            <DatePicker
              value={bookingDate}
              onChange={onBookingDateChange}
              placeholder="Select booking date"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => onStartTimeChange(e.target.value)}
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => onEndTimeChange(e.target.value)}
                className={inputCls}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Booking Fee ($)</label>
            <input
              type="number"
              step="0.01"
              value={bookingFee}
              onChange={(e) => onBookingFeeChange(e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingBooking}
              className="px-5 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl text-xs font-bold disabled:opacity-50 transition shadow-sm cursor-pointer"
            >
              {creatingBooking ? 'Creating...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
