'use client';

import React from 'react';
import Image from 'next/image';
import { Customer, CustomersTabProps } from '@/types/dashboard';

export default function CustomersTab({ customers }: CustomersTabProps) {
  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 font-medium">
        No active customers found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-sm">Active Customer Directory</h3>
        <span className="text-xs text-slate-500 font-medium">
          {customers.length} total customer{customers.length === 1 ? '' : 's'}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase text-[10px]">
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
                  <Image
                    src="/images.png"
                    alt={cust.name}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200 shadow-xs"
                  />
                  {cust.name}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border ${
                      cust.channel === 'WHATSAPP'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {cust.channel}
                  </span>
                </td>
                <td className="p-3 font-mono text-slate-500">{cust.phone}</td>
                <td className="p-3 text-slate-600">
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-700">
                    {cust._count?.messages || 0}
                  </span>
                </td>
                <td className="p-3 text-slate-600">
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-700">
                    {cust._count?.bookings || 0}
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
