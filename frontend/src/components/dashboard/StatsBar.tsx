'use client';

import { MessageSquare, CalendarDays, Users, MapPin } from 'lucide-react';

interface Props {
  conversationsCount: number;
  bookingsCount: number;
  customersCount: number;
  workAreasCount: number;
}

export default function StatsBar({
  conversationsCount,
  bookingsCount,
  customersCount,
  workAreasCount,
}: Props) {
  const stats = [
    { label: 'Total Intakes', value: conversationsCount, icon: <MessageSquare size={18} className="text-[#0F172A]" />, border: 'border-slate-200', bg: 'bg-white', num: 'text-[#0F172A]' },
    { label: 'Confirmed Jobs', value: bookingsCount, icon: <CalendarDays size={18} className="text-[#0F172A]" />, border: 'border-slate-200', bg: 'bg-[#F4FEE5]', num: 'text-[#0F172A]' },
    { label: 'Customers', value: customersCount, icon: <Users size={18} className="text-[#0F172A]" />, border: 'border-slate-200', bg: 'bg-white', num: 'text-[#0F172A]' },
    { label: 'Active Zones', value: workAreasCount, icon: <MapPin size={18} className="text-[#0F172A]" />, border: 'border-slate-200', bg: 'bg-white', num: 'text-[#0F172A]' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 border-b border-slate-200 bg-white">
      {stats.map((s, i) => (
        <div key={i} className={`p-3.5 rounded-2xl border ${s.border} ${s.bg} flex items-center justify-between shadow-2xs`}>
          <div>
            <p className="text-xs text-slate-500 font-bold">{s.label}</p>
            <p className={`text-2xl font-black ${s.num} mt-0.5`}>{s.value}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            {s.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
