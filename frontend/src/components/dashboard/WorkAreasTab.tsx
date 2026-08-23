'use client';

import { WorkArea } from '@/types/dashboard';
import { MapPin, Plus, Trash2, CheckCircle } from 'lucide-react';

interface Props {
  workAreas: WorkArea[];
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export default function WorkAreasTab({ workAreas, onAdd, onDelete }: Props) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Work Area Coverage</h2>
          <p className="text-xs text-slate-500">Define your service zones per date to automatically restrict travel buffers.</p>
        </div>
        <button
          onClick={onAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus size={14} />
          Set Daily Zone
        </button>
      </div>

      {workAreas.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
          <MapPin size={32} className="mx-auto mb-2 text-slate-300" />
          No work areas set yet. Add your coverage zones so intelligent scheduling can calculate travel buffers.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workAreas.map((wa) => (
            <div
              key={wa.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 relative hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <button
                onClick={() => onDelete(wa.id)}
                className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition cursor-pointer"
                title="Delete Area"
              >
                <Trash2 size={13} />
              </button>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                <MapPin size={18} className="text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">{wa.area}</h3>
              <p className="text-xs text-slate-400">{new Date(wa.availableDate).toLocaleDateString()}</p>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <CheckCircle size={10} /> Active Zone
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
