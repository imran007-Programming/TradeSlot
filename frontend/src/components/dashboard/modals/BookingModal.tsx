'use client';

import { DatePicker } from '@/components/ui/date-picker';
import { BookingModalProps } from '@/types/dashboard';

const inputCls = "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/20";

export default function BookingModal({
  customerName,
  bookingError,
  bookingDate,
  startTime,
  endTime,
  bookingFee,
  creatingBooking,
  onBookingDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onBookingFeeChange,
  onSubmit,
  onClose,
}: BookingModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-[#0F172A]">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-[#0F172A]">
            Create Booking {customerName ? `for ${customerName}` : ''}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-slate-100 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {bookingError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl font-medium">
            {bookingError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Booking Date</label>
            <DatePicker value={bookingDate} onChange={onBookingDateChange} placeholder="Select booking date" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => onStartTimeChange(e.target.value)}
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">End Time</label>
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
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Booking Fee ($)</label>
            <input
              type="number"
              step="0.01"
              value={bookingFee}
              onChange={(e) => onBookingFeeChange(e.target.value)}
              className={inputCls}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingBooking}
              className="px-5 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl text-xs font-bold disabled:opacity-50 transition shadow-md shadow-[#E11D48]/20 cursor-pointer"
            >
              {creatingBooking ? 'Creating...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
