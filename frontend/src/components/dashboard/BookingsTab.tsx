'use client';

import { Booking } from '@/types/dashboard';
import { CreditCard, CalendarDays, CheckCircle } from 'lucide-react';

interface Props {
  bookings: Booking[];
  onGeneratePayment: (bookingId: string) => void;
  generatingPayment: string | null;
  onUpdateStatus: (bookingId: string, status: string) => void;
}

export default function BookingsTab({
  bookings,
  onGeneratePayment,
  generatingPayment,
  onUpdateStatus,
}: Props) {
  if (bookings.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        <CalendarDays size={32} className="mx-auto mb-2 text-slate-300" />
        No bookings confirmed yet.
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <th className="p-3">ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Scheduled Time</th>
              <th className="p-3">Fee</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 font-mono text-[#E11D48] font-bold text-xs">#{b.id.substring(0, 8)}</td>
                <td className="p-3 font-bold text-slate-800">{b.customer?.name || 'Customer'}</td>
                <td className="p-3 text-slate-600">
                  {new Date(b.slotStart).toLocaleDateString()} (
                  {new Date(b.slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                  {new Date(b.slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                </td>
                <td className="p-3 font-bold text-slate-900">${b.bookingFee}</td>
                <td className="p-3">
                  {b.payment?.status === 'SUCCEEDED' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      <CheckCircle size={11} className="text-emerald-600" /> Paid
                    </span>
                  ) : b.payment?.status === 'FAILED' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                      Failed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      Unpaid
                    </span>
                  )}
                </td>
                <td className="p-3">
                  <select
                    value={b.status}
                    onChange={(e) => onUpdateStatus(b.id, e.target.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      b.status === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : b.status === 'COMPLETED'
                        ? 'bg-slate-100 text-slate-700 border-slate-300'
                        : b.status === 'CANCELLED'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
                <td className="p-3 text-right">
                  {b.payment?.status !== 'SUCCEEDED' ? (
                    <button
                      onClick={() => onGeneratePayment(b.id)}
                      disabled={generatingPayment === b.id}
                      className="bg-[#E11D48] hover:bg-[#BE123C] text-white px-3 py-1.5 rounded-lg font-bold text-xs disabled:opacity-50 transition inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <CreditCard size={12} />
                      {generatingPayment === b.id ? 'Generating...' : 'Payment Link'}
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                      <CheckCircle size={12} /> Paid
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
