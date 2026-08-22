import { MessageSquare, CalendarDays, Clock, CreditCard } from 'lucide-react';

interface Props {
  conversationsCount: number;
  bookingsCount: number;
  stripeActive: boolean;
}

export default function StatsBar({ conversationsCount, bookingsCount, stripeActive }: Props) {
  const cards = [
    { label: 'Total Intakes', value: conversationsCount, icon: <MessageSquare size={18} className="text-violet-600" />, border: 'border-violet-200', num: 'text-violet-700' },
    { label: 'Confirmed Jobs', value: bookingsCount, icon: <CalendarDays size={18} className="text-emerald-600" />, border: 'border-emerald-200', num: 'text-emerald-700' },
    { label: 'Travel Buffer', value: '30 min', icon: <Clock size={18} className="text-amber-600" />, border: 'border-amber-200', num: 'text-amber-700' },
    { label: 'Stripe Payouts', value: stripeActive ? 'Active' : 'Not Setup', icon: <CreditCard size={18} className="text-sky-600" />, border: 'border-sky-200', num: 'text-sky-700' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 flex-shrink-0">
      {cards.map((card, i) => (
        <div key={i} className={`bg-white border ${card.border} rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow`}>
          <div>
            <p className="text-xs text-slate-500 font-medium">{card.label}</p>
            <h3 className={`text-2xl font-bold mt-0.5 ${card.num}`}>{card.value}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200">{card.icon}</div>
        </div>
      ))}
    </div>
  );
}
