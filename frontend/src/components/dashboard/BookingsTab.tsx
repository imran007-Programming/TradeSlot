import { Plus, CreditCard } from 'lucide-react';
import { Booking } from '@/types/dashboard';

interface Props {
  bookings: Booking[];
  generatingPayment: string | null;
  onStatusChange: (id: string, status: string) => void;
  onGeneratePaymentLink: (id: string) => void;
  onNewBooking: () => void;
}

export default function BookingsTab({ bookings, generatingPayment, onStatusChange, onGeneratePaymentLink, onNewBooking }: Props) {
  return (
    <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-5 min-h-0">
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 pb-4 flex-shrink-0">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Job Bookings</h2>
          <p className="text-xs text-slate-400 mt-0.5">30-min travel buffers applied</p>
        </div>
        <button onClick={onNewBooking} className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5">
          <Plus size={14} /> New Booking
        </button>
      </div>
      <div className="overflow-y-auto flex-1 mt-4">
        <table className="w-full text-left">
          <thead className="text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 text-[10px] sticky top-0 bg-white">
            <tr>
              <th className="p-3">ID</th><th className="p-3">Customer</th><th className="p-3">Slot Time</th>
              <th className="p-3">Fee</th><th className="p-3">Status</th><th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bookings.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-400 text-xs">No bookings found</td></tr>
            ) : bookings.map(b => (
              <tr key={b.id} className="hover:bg-slate-50 transition">
                <td className="p-3 font-mono text-violet-600 font-bold text-xs">#{b.id.substring(0, 8)}</td>
                <td className="p-3">
                  <strong className="text-slate-700 block text-xs">{b.customer?.name || 'Customer'}</strong>
                  <span className="text-[11px] text-slate-400 font-mono">{b.customer?.phone}</span>
                </td>
                <td className="p-3 text-slate-600 text-xs">{new Date(b.slotStart).toLocaleString()} - {new Date(b.slotEnd).toLocaleTimeString()}</td>
                <td className="p-3 font-bold text-slate-800 text-xs">${b.bookingFee}</td>
                <td className="p-3">
                  <select value={b.status} onChange={e => onStatusChange(b.id, e.target.value)}
                    className="bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold px-2 py-1 rounded-lg focus:outline-none">
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
                <td className="p-3">
                  <button onClick={() => onGeneratePaymentLink(b.id)} disabled={generatingPayment === b.id}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg font-semibold text-xs disabled:opacity-50 transition flex items-center gap-1.5">
                    <CreditCard size={12} /> {generatingPayment === b.id ? 'Generating...' : 'Send Link'}
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
