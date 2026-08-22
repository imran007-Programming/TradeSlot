import { Plus, MapPin, CheckCircle, Trash2 } from 'lucide-react';

interface WorkArea {
  id: string;
  availableDate: string;
  area: string;
}

interface Props {
  workAreas: WorkArea[];
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function WorkAreasTab({ workAreas, onDelete, onAdd }: Props) {
  return (
    <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-5 min-h-0">
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 pb-4 flex-shrink-0">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Work Area Zones</h2>
          <p className="text-xs text-slate-400 mt-0.5">Daily service coverage zones for slot availability</p>
        </div>
        <button onClick={onAdd} className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5">
          <Plus size={14} /> Add Zone
        </button>
      </div>
      <div className="overflow-y-auto flex-1 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workAreas.length === 0 ? (
            <div className="col-span-3 text-center py-10 text-slate-400 text-xs">No work areas configured yet.</div>
          ) : workAreas.map(wa => (
            <div key={wa.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 relative hover:border-violet-300 hover:shadow-md transition-all">
              <button onClick={() => onDelete(wa.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition">
                <Trash2 size={13} />
              </button>
              <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
                <MapPin size={18} className="text-violet-600" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">{wa.area}</h3>
              <p className="text-xs text-slate-400">{new Date(wa.availableDate).toLocaleDateString()}</p>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <CheckCircle size={10} /> Active Zone
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
