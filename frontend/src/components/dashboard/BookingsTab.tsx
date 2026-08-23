'use client';

import { Booking } from '@/types/dashboard';
import { CreditCard, CalendarDays } from 'lucide-react';

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
            <tr className="bg-slate-50 border-b border-slate-200 text-[#0F172A] font-bold">
              <th className="p-3">ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Scheduled Time</th>
              <th className="p-3">Fee</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 font-mono text-[#0F172A] font-black text-xs">#{b.id.substring(0, 8)}</td>
                <td className="p-3 font-bold text-slate-800">{b.customer?.name || 'Customer'}</td>
                <td className="p-3 text-slate-600">
                  {new Date(b.slotStart).toLocaleDateString()} (
                  {new Date(b.slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                  {new Date(b.slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                </td>
                <td className="p-3 font-black text-slate-900">${b.bookingFee}</td>
                <td className="p-3">
                  <select
                    value={b.status}
                    onChange={(e) => onUpdateStatus(b.id, e.target.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      b.status === 'CONFIRMED'
                        ? 'bg-[#F4FEE5] text-[#0F172A] border-[#84EA00]'
                        : b.status === 'COMPLETED'
                        ? 'bg-slate-100 text-[#0F172A] border-slate-300'
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
                  <button
                    onClick={() => onGeneratePayment(b.id)}
                    disabled={generatingPayment === b.id}
                    className="bg-[#0F172A] hover:bg-[#1E293B] text-[#84EA00] px-3 py-1.5 rounded-lg font-black text-xs disabled:opacity-50 transition inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <CreditCard size={12} />
                    {generatingPayment === b.id ? 'Generating...' : 'Payment Link'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
