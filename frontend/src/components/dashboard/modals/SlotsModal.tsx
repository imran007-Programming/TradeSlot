'use client';

import React, { useState, useRef, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Loader2, Clock, Car, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';

import { Slot, SlotsModalProps, DayItem } from '@/types/dashboard';
export type { Slot, SlotsModalProps, DayItem };

const fmt = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

// Standard 1-hour slots with 30-minute travel buffers in between (90-minute progression)
// 09:00-10:00 -> buffer 30m -> 10:30-11:30 -> buffer 30m -> 12:00-01:00 -> buffer 30m -> 01:30-02:30 -> etc.
const STANDARD_SLOT_WINDOWS = [
  { startH: 9, startM: 0, endH: 10, endM: 0 },
  { startH: 10, startM: 30, endH: 11, endM: 30 },
  { startH: 12, startM: 0, endH: 13, endM: 0 },
  { startH: 13, startM: 30, endH: 14, endM: 30 },
  { startH: 15, startM: 0, endH: 16, endM: 0 },
  { startH: 16, startM: 30, endH: 17, endM: 30 },
  { startH: 18, startM: 0, endH: 19, endM: 0 },
];

export default function SlotsModal({
  slotsDate,
  availableSlots,
  loadingSlots,
  onDateChange,
  onFetch,
  onSelectSlot,
  onClose,
}: SlotsModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Generate next 21 days from today
  const daysList: DayItem[] = useMemo(() => {
    const list: DayItem[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    for (let i = 0; i < 21; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');

      list.push({
        dateStr: `${year}-${month}-${day}`,
        dayNum: day,
        dayName: i === 0 ? 'TODAY' : dayNames[d.getDay()],
        isToday: i === 0,
      });
    }
    return list;
  }, []);

  const handleDateSelect = (dateStr: string) => {
    onDateChange(dateStr);
    setSelectedSlot(null);
    onFetch(dateStr);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -220 : 220, behavior: 'smooth' });
    }
  };

  const handleConfirm = () => {
    if (!selectedSlot) {
      toast.info('Please select a time slot first');
      return;
    }
    onSelectSlot(selectedSlot);
  };

  // Build slots list with 30-minute buffer progression
  const fullSlotsList = useMemo(() => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const now = new Date();
    const isToday = slotsDate === new Date().toISOString().split('T')[0];

    return STANDARD_SLOT_WINDOWS.map((sw) => {
      const startIso = `${slotsDate}T${pad(sw.startH)}:${pad(sw.startM)}:00`;
      const endIso = `${slotsDate}T${pad(sw.endH)}:${pad(sw.endM)}:00`;
      const slotStartTime = new Date(startIso).getTime();

      const isPast = isToday && slotStartTime <= now.getTime();

      // Match backend returned slot
      const matched = availableSlots.find((s) => {
        const sStart = new Date(s.start);
        return sStart.getHours() === sw.startH && sStart.getMinutes() === sw.startM;
      });

      let status: 'AVAILABLE' | 'BOOKED' | 'PAST' = 'AVAILABLE';
      let available = true;

      if (matched) {
        if (matched.status === 'BOOKED' || matched.available === false) {
          status = 'BOOKED';
          available = false;
        } else if (matched.status === 'PAST' || isPast) {
          status = 'PAST';
          available = false;
        } else {
          status = 'AVAILABLE';
          available = true;
        }
      } else {
        // If availableSlots was returned from backend and this wasn't available
        if (availableSlots.length > 0) {
          status = isPast ? 'PAST' : 'BOOKED';
          available = false;
        } else if (isPast) {
          status = 'PAST';
          available = false;
        }
      }

      return {
        start: startIso,
        end: endIso,
        available,
        status,
      };
    });
  }, [slotsDate, availableSlots]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 text-[#0F172A] relative max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
              Check Available Slots
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              1-hour service duration with automatic 30-minute travel buffers
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Date Carousel */}
        <div className="relative flex items-center px-1">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="absolute left-0 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md text-slate-700 hover:bg-[#FFF1F2] hover:border-[#E11D48] hover:text-[#E11D48] flex items-center justify-center -translate-x-3 sm:-translate-x-4 transition cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-2 px-1 w-full scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {daysList.map((item) => {
              const isSelected = slotsDate === item.dateStr;
              return (
                <button
                  key={item.dateStr}
                  type="button"
                  onClick={() => handleDateSelect(item.dateStr)}
                  className={`flex flex-col items-center justify-center min-w-[62px] sm:min-w-[66px] h-20 rounded-2xl border transition-all cursor-pointer flex-shrink-0 ${
                    isSelected
                      ? 'border-2 border-[#E11D48] bg-[#FFF1F2] text-[#E11D48] shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-[#0F172A]'
                  }`}
                >
                  <span
                    className={`text-xl sm:text-2xl font-bold leading-none ${
                      isSelected ? 'text-[#E11D48]' : 'text-[#0F172A]'
                    }`}
                  >
                    {item.dayNum}
                  </span>
                  <span
                    className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${
                      isSelected ? 'text-[#E11D48]' : 'text-slate-400'
                    }`}
                  >
                    {item.dayName}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="absolute right-0 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md text-slate-700 hover:bg-[#FFF1F2] hover:border-[#E11D48] hover:text-[#E11D48] flex items-center justify-center translate-x-3 sm:translate-x-4 transition cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Buffer Notice Badge */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Car size={14} className="text-[#E11D48]" />
            <span>30-Minute Travel Buffer after each booking</span>
          </span>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>

        {/* Slots Side-by-Side Grid */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Clock size={12} className="text-[#E11D48]" /> Available Slots
          </p>

          {loadingSlots ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-400">
              <Loader2 className="w-7 h-7 animate-spin text-[#E11D48]" />
              <p className="text-xs font-semibold">Calculating schedule with travel buffers...</p>
            </div>
          ) : (
            /* Multi-column responsive grid (side-by-side row cards) */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {fullSlotsList.map((slot, idx) => {
                const isBooked = slot.status === 'BOOKED';
                const isPast = slot.status === 'PAST';
                const isAvailable = slot.available && !isBooked && !isPast;
                const isSelected = selectedSlot?.start === slot.start;

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => isAvailable && setSelectedSlot(slot)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all text-left ${
                      isSelected
                        ? 'border-2 border-[#E11D48] bg-[#E11D48] text-white shadow-md'
                        : isAvailable
                        ? 'border-slate-200 bg-white hover:border-[#E11D48] hover:bg-[#FFF1F2] text-[#0F172A] cursor-pointer'
                        : isBooked
                        ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed opacity-85'
                        : 'border-slate-100 bg-slate-50/60 text-slate-300 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {/* Left: Clock Icon + Time Range */}
                    <div className="flex items-center gap-2 min-w-0">
                      <Clock
                        size={14}
                        className={
                          isSelected
                            ? 'text-white'
                            : isAvailable
                            ? 'text-[#E11D48]'
                            : 'text-slate-400'
                        }
                      />
                      <span
                        className={`font-bold text-xs sm:text-sm truncate ${
                          isSelected
                            ? 'text-white'
                            : isAvailable
                            ? 'text-[#0F172A]'
                            : 'text-slate-500'
                        }`}
                      >
                        {fmt(slot.start)} – {fmt(slot.end)}
                      </span>
                    </div>

                    {/* Right: Status Badge (Available / Booked / Passed) */}
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex-shrink-0 ml-2 ${
                        isSelected
                          ? 'bg-white/25 text-white border-white/40'
                          : isAvailable
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isBooked
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}
                    >
                      {isBooked ? 'Booked' : isPast ? 'Passed' : 'Available'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {!loadingSlots && availableSlots.length === 0 && (
            <div className="p-3.5 bg-[#FFF1F2] border border-[#E11D48]/30 rounded-2xl text-center flex items-center justify-center gap-2">
              <AlertCircle size={15} className="text-[#E11D48] flex-shrink-0" />
              <p className="text-xs text-[#E11D48] font-bold">
                Note: No custom work area zone was set for this date yet. Default standard hours are shown.
              </p>
            </div>
          )}
        </div>

        {/* Confirm Action */}
        <div className="pt-2 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedSlot || loadingSlots}
            className="w-full sm:w-72 py-3.5 bg-[#E11D48] hover:bg-[#BE123C] active:scale-98 text-white font-bold rounded-2xl shadow-lg shadow-[#E11D48]/25 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm cursor-pointer"
          >
            Confirm Schedule
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
