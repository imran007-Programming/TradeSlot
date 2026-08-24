'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { MessageSquare, CreditCard, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { Booking } from '@/types';
import PageLoading from '@/components/dashboard/PageLoading';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [generatingPayment, setGeneratingPayment] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await apiClient.get('/bookings');
      if (res.success) {
        setBookings(res.data || []);
      }
    } catch {} finally {
      setLoading(false);
    }
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
          setDeletingId(bookingId);
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
          } finally {
            setDeletingId(null);
          }
        },
      },
      cancel: { label: 'Cancel', onClick: () => {} },
    });
  };

  if (loading) {
    return <PageLoading text="Loading bookings directory..." />;
  }

  return (
    <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-5 min-h-0">
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 pb-4 flex-shrink-0">
        <div>
          <h2 className="text-sm font-bold text-[#0F172A]">Bookings Directory</h2>
          <p className="text-xs text-slate-400 mt-0.5">All scheduled and completed client jobs</p>
        </div>
      </div>
      <div className="overflow-y-auto flex-1 mt-4">
        <table className="w-full text-left">
          <thead className="text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 text-[10px] sticky top-0 bg-white">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Fee</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-400 text-xs">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((b) => {
                const isPaid = b.payment?.status === 'SUCCEEDED';
                return (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors text-xs">
                    <td className="p-3 font-bold text-[#0F172A]">{b.customer?.name || 'Customer'}</td>
                    <td className="p-3 font-mono text-slate-500">{b.customer?.phone}</td>
                    <td className="p-3 font-semibold text-slate-700">
                      {new Date(b.slotStart).toLocaleDateString()} -{' '}
                      {new Date(b.slotStart).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-3 font-bold text-slate-900">${b.bookingFee}</td>
                    <td className="p-3">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <CheckCircle size={10} className="text-emerald-600" /> Paid
                        </span>
                      ) : (
                        <button
                          onClick={() => handleGeneratePaymentLink(b.id)}
                          disabled={generatingPayment === b.id}
                          className="text-[10px] bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold px-2.5 py-1 rounded-lg transition disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                        >
                          <CreditCard size={11} />
                          <span>{generatingPayment === b.id ? 'Sending...' : 'Send Link'}</span>
                        </button>
                      )}
                    </td>
                    <td className="p-3">
                      <select
                        value={b.status}
                        onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                        className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 focus:outline-none"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteBooking(b.id)}
                        disabled={deletingId === b.id}
                        className="text-slate-400 hover:text-red-500 transition p-1 cursor-pointer disabled:opacity-40"
                        title="Delete Booking"
                      >
                        {deletingId === b.id ? (
                          <Loader2 size={14} className="animate-spin text-red-500" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
