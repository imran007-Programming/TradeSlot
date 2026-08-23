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
    { label: 'Total Intakes', value: conversationsCount, icon: <MessageSquare size={18} className="text-indigo-600" />, border: 'border-indigo-100', bg: 'bg-indigo-50/50', num: 'text-indigo-900' },
    { label: 'Confirmed Jobs', value: bookingsCount, icon: <CalendarDays size={18} className="text-emerald-600" />, border: 'border-emerald-100', bg: 'bg-emerald-50/50', num: 'text-emerald-900' },
    { label: 'Customers', value: customersCount, icon: <Users size={18} className="text-blue-600" />, border: 'border-blue-100', bg: 'bg-blue-50/50', num: 'text-blue-900' },
    { label: 'Active Zones', value: workAreasCount, icon: <MapPin size={18} className="text-amber-600" />, border: 'border-amber-100', bg: 'bg-amber-50/50', num: 'text-amber-900' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 border-b border-slate-200 bg-white">
      {stats.map((s, i) => (
        <div key={i} className={`p-3.5 rounded-2xl border ${s.border} ${s.bg} flex items-center justify-between`}>
          <div>
            <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold ${s.num} mt-0.5`}>{s.value}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            {s.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
