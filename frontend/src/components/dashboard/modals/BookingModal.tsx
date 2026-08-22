interface Props {
  customerName?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  bookingFee: string;
  bookingError: string;
  creatingBooking: boolean;
  onDateChange: (v: string) => void;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  onFeeChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const inputCls = "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100";

export default function BookingModal({ customerName, bookingDate, startTime, endTime, bookingFee, bookingError, creatingBooking, onDateChange, onStartChange, onEndChange, onFeeChange, onSubmit, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-800">
          Create Booking {customerName ? 'for ' + customerName : ''}
        </h3>
        {bookingError && <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl">{bookingError}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Booking Date</label>
            <input type="date" value={bookingDate} onChange={e => onDateChange(e.target.value)} className={inputCls} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Start Time</label>
              <input type="time" value={startTime} onChange={e => onStartChange(e.target.value)} className={inputCls} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">End Time</label>
              <input type="time" value={endTime} onChange={e => onEndChange(e.target.value)} className={inputCls} required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Booking Fee ($)</label>
            <input type="number" step="0.01" value={bookingFee} onChange={e => onFeeChange(e.target.value)} className={inputCls} required />
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2.5 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={creatingBooking} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold disabled:opacity-50">
              {creatingBooking ? 'Creating...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
