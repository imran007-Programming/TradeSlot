'use client';

import React, { useState, useRef, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
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
  { startHour: 9, endHour: 10, labelNum: '9 - 10', labelMeridiem: 'am' },
  { startHour: 10, endHour: 11, labelNum: '10 - 11', labelMeridiem: 'am' },
  { startHour: 11, endHour: 12, labelNum: '11 - 12', labelMeridiem: 'pm' },
  { startHour: 12, endHour: 13, labelNum: '12 - 1', labelMeridiem: 'pm' },
  { startHour: 13, endHour: 14, labelNum: '1 - 2', labelMeridiem: 'pm' },
  { startHour: 14, endHour: 15, labelNum: '2 - 3', labelMeridiem: 'pm' },
  { startHour: 15, endHour: 16, labelNum: '3 - 4', labelMeridiem: 'pm' },
  { startHour: 16, endHour: 17, labelNum: '4 - 5', labelMeridiem: 'pm' },
  { startHour: 17, endHour: 18, labelNum: '5 - 6', labelMeridiem: 'pm' },
  { startHour: 18, endHour: 19, labelNum: '6 - 7', labelMeridiem: 'pm' },
  { startHour: 19, endHour: 20, labelNum: '7 - 8', labelMeridiem: 'pm' },
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

  const handleDateSelect = (dateStr: string) => {
    onDateChange(dateStr);
    setSelectedSlot(null);
    onFetch(dateStr);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getTimeWindowStatus = (tw: typeof STANDARD_TIME_WINDOWS[0]) => {
    const matchingSlot = availableSlots.find((s) => {
      const sDate = new Date(s.start);
      return sDate.getHours() === tw.startHour;
    });

    if (matchingSlot) {
      return { available: true, slot: matchingSlot };
    }

    const pad = (n: number) => n.toString().padStart(2, '0');
    const startIso = `${slotsDate}T${pad(tw.startHour)}:00:00`;
    const endIso = `${slotsDate}T${pad(tw.endHour)}:00:00`;

    return {
      available: false,
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
    <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 text-[#0F172A] relative max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h2 className="text-base sm:text-lg font-black text-[#0F172A]">
            Select Schedule
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-[#0F172A] bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Main Heading & Date Subtitle */}
        <div className="text-center space-y-1.5 pt-1">
          <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
            When would you like TradeSlot to serve you?
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Select your preferred date
          </p>
        </div>

        {/* Date Selector Carousel */}
        <div className="relative flex items-center px-1">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="absolute left-0 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md text-[#0F172A] hover:bg-[#F4FEE5] hover:border-[#84EA00] flex items-center justify-center -translate-x-3 sm:-translate-x-4 transition cursor-pointer"
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
                      ? 'border-2 border-[#0F172A] bg-[#0F172A] text-white shadow-md'
                      : 'border-slate-200 bg-white hover:border-[#84EA00] hover:bg-[#F4FEE5]/50 text-[#0F172A]'
                  }`}
                >
                  <span
                    className={`text-xl sm:text-2xl font-black leading-none ${
                      isSelected ? 'text-[#84EA00]' : 'text-[#0F172A]'
                    }`}
                  >
                    {item.dayNum}
                  </span>
                  <span
                    className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${
                      isSelected ? 'text-white' : 'text-slate-400'
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
            className="absolute right-0 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md text-[#0F172A] hover:bg-[#F4FEE5] hover:border-[#84EA00] flex items-center justify-center translate-x-3 sm:translate-x-4 transition cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Time Slot Selection Heading */}
        <div className="text-center space-y-1 pt-2">
          <p className="text-xs sm:text-sm text-slate-600 font-semibold">
            Select your preferred time, expert will arrive by your selected time
          </p>
        </div>

        {/* Time Slots Grid */}
        <div className="space-y-4">
          {loadingSlots ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-400">
              <Loader2 className="w-7 h-7 animate-spin text-[#0F172A]" />
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
                        ? 'border-2 border-[#0F172A] bg-[#0F172A] text-[#84EA00] shadow-md ring-2 ring-[#84EA00]/40'
                        : available
                        ? 'border-slate-200 bg-white hover:border-[#84EA00] hover:bg-[#F4FEE5] text-[#0F172A]'
                        : 'border-slate-100 bg-slate-50/60 text-slate-300 opacity-40 cursor-not-allowed line-through'
                    }`}
                  >
                    <span className={isSelected ? 'text-[#84EA00] font-black' : available ? 'text-[#0F172A]' : 'text-slate-300'}>
                      {tw.labelNum}
                    </span>
                    <span className={`text-xs font-semibold ${isSelected ? 'text-[#84EA00]' : 'text-slate-500'}`}>
                      {tw.labelMeridiem}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {!loadingSlots && availableSlots.length === 0 && (
            <div className="p-4 bg-[#F4FEE5] border border-[#84EA00]/40 rounded-2xl text-center">
              <p className="text-xs text-[#0F172A] font-bold">
                ⚠️ No slots available for this date. (Please make sure Work Area Zone is set or pick another date).
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
            className="w-full sm:w-72 py-3.5 bg-[#84EA00] hover:bg-[#74D100] active:scale-98 text-[#0F172A] font-black rounded-2xl shadow-lg shadow-[#84EA00]/30 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm flex items-center justify-center gap-2 cursor-pointer border border-[#84EA00]"
          >
            <span>Confirm Schedule</span>
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-[#0F172A] transition cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
