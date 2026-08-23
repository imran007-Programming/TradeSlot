import { MessageSquare, RefreshCw, Search, Trash2 } from 'lucide-react';
import { Conversation } from '@/types/dashboard';

interface Props {
  conversations: Conversation[];
  selectedId: string | null;
  searchTerm: string;
  onSelect: (conv: Conversation) => void;
  onSearch: (term: string) => void;
  onRefresh: () => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

export default function ConversationList({ conversations, selectedId, searchTerm, onSelect, onSearch, onRefresh, onDelete, onStatusChange }: Props) {
  return (
    <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 space-y-2 flex-shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-700">Intake Queue</h2>
          <button onClick={onRefresh} className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1.5 transition cursor-pointer group">
            <RefreshCw size={12} className="transition-transform group-hover:rotate-180 duration-500" /> Refresh
          </button>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search name or phone..." value={searchTerm} onChange={e => onSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
        </div>
      </div>
      <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">No conversations found</div>
        ) : conversations.map(conv => {
          const isSelected = selectedId === conv.id;
          const isWA = conv.channel === 'WHATSAPP';
          return (
            <button key={conv.id} onClick={() => onSelect(conv)}
              className={`w-full text-left p-3.5 transition-all ${isSelected ? 'bg-violet-50 border-l-2 border-violet-500' : 'hover:bg-slate-50 border-l-2 border-transparent'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-slate-800 text-xs">{conv.customer.name}</h4>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{conv.customer.phone}</p>
                </div>
                <div className="flex items-center gap-1">
                  <select value={conv.status}
                    onChange={e => { e.stopPropagation(); onStatusChange(conv.id, e.target.value); }}
                    onClick={e => e.stopPropagation()}
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 focus:outline-none">
                    <option value="OPEN">OPEN</option>
                    <option value="BOOKED">BOOKED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                  <button onClick={e => { e.stopPropagation(); onDelete(conv.id); }} className="text-slate-400 hover:text-red-500 transition p-0.5">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 border ${isWA ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-violet-50 text-violet-600 border-violet-200'}`}>
                  <MessageSquare size={10} /> {isWA ? 'WhatsApp' : 'Web Chat'}
                </span>
                <span className="text-slate-400 text-[10px]">{conv.messages.length} msgs</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
