'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  MapPin,
  ChevronRight,
  Zap,
  Lightbulb,
  Wrench,
  Flame,
  Hammer,
  Home as HomeIcon,
  Palette,
  Check,
} from 'lucide-react';
import { SERVICE_CATEGORIES, FEATURED_TRADES } from '@/data';

interface Props {
  onOpenChat: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  All: <Zap size={14} />,
  Electrician: <Lightbulb size={14} />,
  Plumber: <Wrench size={14} />,
  HVAC: <Flame size={14} />,
  Carpentry: <Hammer size={14} />,
  Roofing: <HomeIcon size={14} />,
  Painting: <Palette size={14} />,
};

export default function ServicesSection({ onOpenChat }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTrades = FEATURED_TRADES.filter((t) => {
    return selectedCategory === 'All' || t.category === selectedCategory;
  });

  return (
    <section id="services" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
            Popular Home Services &amp; Trade Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Background-checked professionals with open schedule slots.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none justify-start sm:justify-center">
          {SERVICE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const icon = CATEGORY_ICONS[cat.id] || <Zap size={14} />;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#E11D48] text-white shadow-md shadow-[#E11D48]/25 scale-102'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Trade Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredTrades.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-[#E11D48] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group space-y-4"
            >
              <div>
                {/* Card Image */}
                <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#0F172A] text-white px-2.5 py-1 rounded-xl text-[11px] font-bold shadow-xs">
                    {item.category}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-[#E11D48] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                    {item.tag}
                  </span>
                </div>

                {/* Title & Trader Info */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-sm text-[#0F172A] group-hover:text-[#E11D48] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-800">
                    {item.traderName} • <span className="text-slate-500 font-normal">{item.role}</span>
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin size={12} className="text-slate-400" />
                    {item.area}
                  </p>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {item.features.map((f, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium flex items-center gap-1"
                    >
                      <Check size={10} className="text-emerald-600 stroke-[3]" />
                      <span>{f}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase">Rates from</span>
                  <p className="text-base font-bold text-[#0F172A]">
                    {item.hourlyRate}
                    <span className="text-xs font-normal text-slate-500">/hr</span>
                  </p>
                </div>
                <button
                  onClick={onOpenChat}
                  className="px-4 py-2 bg-[#0F172A] hover:bg-[#E11D48] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm group-hover:bg-[#E11D48] cursor-pointer"
                >
                  <span>Book Slot</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
