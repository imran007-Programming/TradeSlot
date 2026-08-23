'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export interface Slot {
  start: string;
  end: string;
}

interface Props {
  slotsDate: string;
  availableSlots: Slot[];
  loadingSlots: boolean;
  onDateChange: (dateStr: string) => void;
  onFetch: (dateStr?: string) => void;
  onSelectSlot: (slot: Slot) => void;
  onClose: () => void;
}

interface DayItem {
  dateStr: string;
  dayNum: string;
  dayName: string;
  isToday: boolean;
  dateObj: Date;
}

// Pre-defined hourly slots from 9:00 AM to 8:00 PM
const STANDARD_TIME_WINDOWS = [
  { startHour: 9, endHour: 10, labelNum: '9 - 10', labelMeridiem: 'am', startStr: '09:00', endStr: '10:00' },
  { startHour: 10, endHour: 11, labelNum: '10 - 11', labelMeridiem: 'am', startStr: '10:00', endStr: '11:00' },
  { startHour: 11, endHour: 12, labelNum: '11 - 12', labelMeridiem: 'pm', startStr: '11:00', endStr: '12:00' },
  { startHour: 12, endHour: 13, labelNum: '12 - 1', labelMeridiem: 'pm', startStr: '12:00', endStr: '13:00' },
  { startHour: 13, endHour: 14, labelNum: '1 - 2', labelMeridiem: 'pm', startStr: '13:00', endStr: '14:00' },
  { startHour: 14, endHour: 15, labelNum: '2 - 3', labelMeridiem: 'pm', startStr: '14:00', endStr: '15:00' },
  { startHour: 15, endHour: 16, labelNum: '3 - 4', labelMeridiem: 'pm', startStr: '15:00', endStr: '16:00' },
  { startHour: 16, endHour: 17, labelNum: '4 - 5', labelMeridiem: 'pm', startStr: '16:00', endStr: '17:00' },
  { startHour: 17, endHour: 18, labelNum: '5 - 6', labelMeridiem: 'pm', startStr: '17:00', endStr: '18:00' },
  { startHour: 18, endHour: 19, labelNum: '6 - 7', labelMeridiem: 'pm', startStr: '18:00', endStr: '19:00' },
  { startHour: 19, endHour: 20, labelNum: '7 - 8', labelMeridiem: 'pm', startStr: '19:00', endStr: '20:00' },
];

export default function SlotsModal({
  slotsDate,
  availableSlots,
  loadingSlots,
  onDateChange,
  onFetch,
  onSelectSlot,
  onClose,
}: Props) {
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
      const dateStr = `${year}-${month}-${day}`;

      list.push({
        dateStr,
        dayNum: day,
        dayName: i === 0 ? 'TODAY' : dayNames[d.getDay()],
        isToday: i === 0,
        dateObj: d,
      });
    }
    return list;
  }, []);

  // Fetch slots whenever selected date changes
  const handleDateSelect = (dateStr: string) => {
    onDateChange(dateStr);
    setSelectedSlot(null);
    onFetch(dateStr);
  };

  // Scroll horizontal carousel
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Check if a standard window is available in availableSlots
  const getTimeWindowStatus = (tw: typeof STANDARD_TIME_WINDOWS[0]) => {
    // Find matching slot in availableSlots returned by backend
    const matchingSlot = availableSlots.find((s) => {
      const sDate = new Date(s.start);
      return sDate.getHours() === tw.startHour;
    });

    if (matchingSlot) {
      return { available: true, slot: matchingSlot };
    }

    // Fallback: construct standard slot object
    const pad = (n: number) => n.toString().padStart(2, '0');
    const startIso = `${slotsDate}T${pad(tw.startHour)}:00:00`;
    const endIso = `${slotsDate}T${pad(tw.endHour)}:00:00`;

    return {
      available: availableSlots.length === 0 ? false : false,
      slot: { start: startIso, end: endIso },
    };
  };

  const handleConfirm = () => {
    if (!selectedSlot) {
      toast.info('Please select a time slot first');
      return;
    }
    onSelectSlot(selectedSlot);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 text-slate-800 relative max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-800">
            Select Schedule
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Main Heading & Date Subtitle */}
        <div className="text-center space-y-1.5 pt-1">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            When would you like TradeSlot to serve you?
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Select your prefer date
          </p>
        </div>

        {/* Date Selector Carousel */}
        <div className="relative flex items-center px-1">
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="absolute left-0 z-10 w-8 h-8 rounded-full bg-white/95 border border-slate-200 shadow-md text-slate-600 hover:text-pink-600 hover:border-pink-300 flex items-center justify-center -translate-x-3 sm:-translate-x-4 transition cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Dates Horizontal Row */}
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
                      ? 'border-2 border-pink-600 bg-pink-50/50 shadow-sm shadow-pink-100 scale-102'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-700'
                  }`}
                >
                  <span
                    className={`text-xl sm:text-2xl font-black leading-none ${
                      isSelected ? 'text-pink-600' : 'text-slate-800'
                    }`}
                  >
                    {item.dayNum}
                  </span>
                  <span
                    className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${
                      isSelected ? 'text-pink-600' : 'text-slate-400'
                    }`}
                  >
                    {item.dayName}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="absolute right-0 z-10 w-8 h-8 rounded-full bg-white/95 border border-slate-200 shadow-md text-slate-600 hover:text-pink-600 hover:border-pink-300 flex items-center justify-center translate-x-3 sm:translate-x-4 transition cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Time Slot Selection Heading */}
        <div className="text-center space-y-1 pt-2">
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Select your prefer time, expert will arrive by your selected time
          </p>
        </div>

        {/* Time Slots Grid */}
        <div className="space-y-4">
          {loadingSlots ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-400">
              <Loader2 className="w-7 h-7 animate-spin text-pink-600" />
              <p className="text-xs font-semibold">Checking available time slots...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STANDARD_TIME_WINDOWS.map((tw, idx) => {
                const { available, slot } = getTimeWindowStatus(tw);
                const isSelected = selectedSlot?.start === slot.start;

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={!available}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 px-3.5 rounded-2xl border text-center font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'border-2 border-pink-600 bg-pink-50/60 text-pink-600 shadow-sm shadow-pink-100 ring-2 ring-pink-100/50'
                        : available
                        ? 'border-slate-200 bg-white hover:border-pink-300 hover:bg-pink-50/20 text-slate-800'
                        : 'border-slate-100 bg-slate-50/60 text-slate-300 opacity-40 cursor-not-allowed line-through'
                    }`}
                  >
                    <span className={isSelected ? 'text-pink-600' : available ? 'text-pink-600' : 'text-slate-300'}>
                      {tw.labelNum}
                    </span>
                    <span className={`text-xs font-semibold ${isSelected ? 'text-pink-600' : 'text-slate-500'}`}>
                      {tw.labelMeridiem}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {!loadingSlots && availableSlots.length === 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center">
              <p className="text-xs text-amber-800 font-semibold">
                ⚠️ No slots available for this date. (Please make sure Work Area Zone is set for this date or pick another date).
              </p>
            </div>
          )}
        </div>

        {/* Confirm Action Button */}
        <div className="pt-4 flex flex-col items-center justify-center space-y-3">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedSlot || loadingSlots}
            className="w-full sm:w-72 py-3.5 bg-pink-600 hover:bg-pink-700 active:scale-98 text-white font-extrabold rounded-2xl shadow-lg shadow-pink-600/25 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Confirm Schedule</span>
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
