import { Clock } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';

interface Slot {
  start: string;
  end: string;
}

interface Props {
  slotsDate: string;
  availableSlots: Slot[];
  loadingSlots: boolean;
  onDateChange: (v: string) => void;
  onFetch: () => void;
  onSelectSlot: (slot: Slot) => void;
  onClose: () => void;
}

export default function SlotsModal({
  slotsDate,
  availableSlots,
  loadingSlots,
  onDateChange,
  onFetch,
  onSelectSlot,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Available Slots (30m Buffer)</h3>
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <DatePicker value={slotsDate} onChange={onDateChange} placeholder="Select date" />
          </div>
          <button
            onClick={onFetch}
            disabled={loadingSlots}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs flex-shrink-0"
          >
            {loadingSlots ? 'Loading...' : 'Check'}
          </button>
        </div>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {availableSlots.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No slots available or work area not set.</p>
          ) : availableSlots.map((slot, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-200 flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Clock size={12} className="text-slate-400" />
                {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <button onClick={() => onSelectSlot(slot)} className="bg-violet-600 hover:bg-violet-700 text-white text-[11px] px-3 py-1.5 rounded-lg font-bold">
                Select
              </button>
            </div>
          ))}
        </div>
        <div className="text-right">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50">Close</button>
        </div>
      </div>
    </div>
  );
}
