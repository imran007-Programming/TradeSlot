'use client';

import { Users, MessageSquare, CalendarDays } from 'lucide-react';

interface CustomerItem {
  id: string;
  name: string;
  phone: string;
  channel: string;
  totalMessages: number;
  bookingsCount: number;
  status: string;
}

interface Props {
  customers: CustomerItem[];
}

export default function CustomersTab({ customers }: Props) {
  if (customers.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        <Users size={32} className="mx-auto mb-2 text-slate-300" />
        No customer intake profiles found.
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[#0F172A] font-bold">
              <th className="p-3">Customer</th>
              <th className="p-3">Channel</th>
              <th className="p-3">Phone Number</th>
              <th className="p-3">Messages</th>
              <th className="p-3">Bookings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((cust) => (
              <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                  <img
                    src="/images.png"
                    alt={cust.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200 shadow-xs"
                  />
                  {cust.name}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border ${
                      cust.channel === 'WHATSAPP'
                        ? 'bg-[#F4FEE5] text-[#0F172A] border-[#84EA00]'
                        : 'bg-slate-100 text-[#0F172A] border-slate-200'
                    }`}
                  >
                    {cust.channel}
                  </span>
                </td>
                <td className="p-3 font-mono text-slate-500">{cust.phone}</td>
                <td className="p-3 text-slate-600">
                  <span className="inline-flex items-center gap-1 font-bold text-[#0F172A]">
                    <MessageSquare size={11} className="text-[#0F172A]" />
                    {cust.totalMessages}
                  </span>
                </td>
                <td className="p-3 text-slate-600">
                  <span className="inline-flex items-center gap-1 font-bold text-[#0F172A]">
                    <CalendarDays size={11} className="text-[#84EA00]" />
                    {cust.bookingsCount}
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
