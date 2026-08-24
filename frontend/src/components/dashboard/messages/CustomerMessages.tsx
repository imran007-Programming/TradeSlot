'use client';

import React from 'react';
import Image from 'next/image';
import { Conversation } from '@/types';
import { Search, RefreshCw, Trash2, MessageSquare } from 'lucide-react';

interface Props {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  onSelectConversation: (conv: Conversation) => void;
  onUpdateStatus: (convId: string, status: string) => void;
  onDeleteConversation: (convId: string) => void;
}

export default function CustomerMessages({
  conversations,
  selectedConversation,
  searchTerm,
  onSearchChange,
  isRefreshing,
  onRefresh,
  onSelectConversation,
  onUpdateStatus,
  onDeleteConversation,
}: Props) {
  const filteredConversations = conversations.filter(
    (c) =>
      c.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customer.phone.includes(searchTerm)
  );

  const inputCls =
    'w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

  return (
    <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header with Search and Refresh */}
      <div className="p-4 border-b border-slate-100 space-y-2 flex-shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-[#0F172A]">Customer Messages</h2>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-xs font-semibold text-[#E11D48] hover:text-[#BE123C] flex items-center gap-1.5 transition cursor-pointer disabled:opacity-60"
          >
            <RefreshCw
              size={12}
              className={
                isRefreshing
                  ? 'animate-spin text-[#E11D48]'
                  : 'transition-transform hover:rotate-180 duration-500'
              }
            />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name or phone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">No conversations found</div>
        ) : (
          filteredConversations.map((conv) => {
            const isSelected = selectedConversation?.id === conv.id;
            const isWA = conv.channel === 'WHATSAPP';

            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className={`w-full text-left p-3.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFF1F2] border-l-4 border-[#E11D48]'
                    : 'hover:bg-slate-50 border-l-4 border-transparent'
                }`}
              >
                <div className="flex justify-between items-start gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Image
                      src="/images.png"
                      alt={conv.customer.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 flex-shrink-0 shadow-xs"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#0F172A] text-xs truncate">
                        {conv.customer.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                        {conv.customer.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <select
                      value={conv.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        onUpdateStatus(conv.id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 focus:outline-none"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="BOOKED">BOOKED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                    <button
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                      className="text-slate-400 hover:text-red-500 transition p-0.5 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 border ${
                      isWA
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    <MessageSquare size={10} /> {isWA ? 'WhatsApp' : 'Web Chat'}
                  </span>
                  <span className="text-slate-400 text-[10px]">{conv.messages.length} msgs</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
