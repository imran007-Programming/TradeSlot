import { CheckCircle } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  channel: string;
  totalMessages: number;
  bookingsCount: number;
  status: string;
}

interface Props {
  customers: Customer[];
}

export default function CustomersTab({ customers }: Props) {
  return (
    <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-5 min-h-0">
      <div className="border-b border-slate-100 pb-4 flex-shrink-0">
        <h2 className="text-sm font-bold text-slate-800">Customers Directory</h2>
        <p className="text-xs text-slate-400 mt-0.5">All intake records from WhatsApp and Web Chat</p>
      </div>
      <div className="overflow-y-auto flex-1 mt-4">
        <table className="w-full text-left">
          <thead className="text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 text-[10px] sticky top-0 bg-white">
            <tr>
              <th className="p-3">Name</th><th className="p-3">Phone</th><th className="p-3">Channel</th>
              <th className="p-3">Messages</th><th className="p-3">Bookings</th><th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {customers.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-400 text-xs">No customers yet</td></tr>
            ) : customers.map(cust => (
              <tr key={cust.id} className="hover:bg-slate-50 transition">
                <td className="p-3 font-semibold text-slate-700 text-xs">{cust.name}</td>
                <td className="p-3 font-mono text-slate-500 text-xs">{cust.phone}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border ${cust.channel === 'WHATSAPP' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-violet-50 text-violet-600 border-violet-200'}`}>
                    {cust.channel}
                  </span>
                </td>
                <td className="p-3 text-slate-500 text-xs">{cust.totalMessages} msgs</td>
                <td className="p-3 text-emerald-600 font-semibold text-xs">{cust.bookingsCount} booked</td>
                <td className="p-3">
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit">
                    <CheckCircle size={10} /> Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
