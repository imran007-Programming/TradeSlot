'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { MessageSquare, CreditCard, Trash2, CheckCircle } from 'lucide-react';
import { Booking } from '@/types';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [generatingPayment, setGeneratingPayment] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await apiClient.get('/bookings');
      if (res.success) {
        setBookings(res.data || []);
      }
    } catch {}
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleGeneratePaymentLink = async (bookingId: string) => {
    setGeneratingPayment(bookingId);
    try {
      const res = await apiClient.post('/payments/checkout/' + bookingId);
      if (res.success && res.data?.checkoutUrl) {
        const targetBooking = bookings.find((b) => b.id === bookingId);
        const convId = targetBooking?.conversationId || (targetBooking as any)?.conversation?.id;

        if (convId) {
          await apiClient.post('/conversations/' + convId + '/messages', {
            content: 'Payment Link: ' + res.data.checkoutUrl,
          });
          toast.success('Payment link sent to customer!');
        } else {
          toast.info('Payment link:\n\n' + res.data.checkoutUrl);
        }
        await fetchBookings();
        window.dispatchEvent(new Event('dashboard:refresh'));
      } else {
        toast.error(res.message || 'Failed to generate payment link');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setGeneratingPayment(null);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const res = await apiClient.patch('/bookings/' + bookingId + '/status', { status });
      if (res.success) {
        toast.success('Booking status updated!');
        await fetchBookings();
        window.dispatchEvent(new Event('dashboard:refresh'));
      } else {
        toast.error(res.message || 'Failed to update booking status');
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteBooking = (bookingId: string) => {
    toast('Delete this booking?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            const res = await apiClient.delete('/bookings/' + bookingId);
            if (res.success) {
              toast.success('Booking deleted!');
              await fetchBookings();
              window.dispatchEvent(new Event('dashboard:refresh'));
            } else {
              toast.error(res.message || 'Failed to delete booking');
            }
          } catch (err: any) {
            toast.error(err.message);
          }
        },
      },
      cancel: { label: 'Cancel', onClick: () => {} },
    });
  };

  return (
    <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-5 min-h-0">
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 pb-4 flex-shrink-0">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Job Bookings</h2>
          <p className="text-xs text-slate-400 mt-0.5">30-min travel buffers applied</p>
        </div>
        <span className="text-[11px] text-slate-400 flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
          <MessageSquare size={11} /> To create a booking, select a conversation from Messages tab
        </span>
      </div>
      <div className="overflow-y-auto flex-1 mt-4">
        <table className="w-full text-left">
          <thead className="text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 text-[10px] sticky top-0 bg-white">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Slot Time</th>
              <th className="p-3">Fee</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-mono text-[#E11D48] font-bold text-xs">
                    #{b.id.substring(0, 8)}
                  </td>
                  <td className="p-3">
                    <strong className="text-slate-700 block text-xs">{b.customer?.name || 'Customer'}</strong>
                    <span className="text-[11px] text-slate-400 font-mono">{b.customer?.phone}</span>
                  </td>
                  <td className="p-3 text-slate-600 text-xs">
                    {new Date(b.slotStart).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}{' '}
                    -{' '}
                    {new Date(b.slotEnd).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </td>
                  <td className="p-3 font-bold text-slate-800 text-xs">${b.bookingFee}</td>
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
                      onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                      className="bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold px-2 py-1 rounded-lg focus:outline-none"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {b.payment?.status !== 'SUCCEEDED' ? (
                        <button
                          onClick={() => handleGeneratePaymentLink(b.id)}
                          disabled={generatingPayment === b.id}
                          className="bg-[#E11D48] hover:bg-[#BE123C] text-white px-3 py-1.5 rounded-lg font-semibold text-xs disabled:opacity-50 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <CreditCard size={12} /> {generatingPayment === b.id ? 'Generating...' : 'Send Link'}
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                          <CheckCircle size={12} /> Paid
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteBooking(b.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 px-2 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
