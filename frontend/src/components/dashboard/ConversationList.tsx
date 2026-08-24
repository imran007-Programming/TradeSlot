"use client";

import React from "react";
import Image from "next/image";
import { Conversation, ConversationListProps } from "@/types/dashboard";
import { MessageSquare, RefreshCw, Search } from "lucide-react";

export default function ConversationList({
  conversations,
  selectedConversation,
  searchQuery,
  onSearchChange,
  onSelect,
  onRefresh,
  isRefreshing = false,
}: ConversationListProps) {
  return (
    <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-white flex-shrink-0">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <h2 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
          <MessageSquare size={16} className="text-[#E11D48]" />
          Intake Queue
        </h2>
        <button
          onClick={onRefresh}
          className="text-xs font-semibold text-slate-600 hover:text-[#E11D48] flex items-center gap-1.5 transition cursor-pointer group"
          title="Refresh Intakes"
        >
          <RefreshCw
            size={13}
            className={`transition-transform duration-500 group-hover:rotate-180 ${
              isRefreshing ? "animate-spin text-[#E11D48]" : ""
            }`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="p-3 border-b border-slate-200 bg-white">
        <div className="relative">
          <Search
            size={13}
            className="absolute left-2.5 top-2.5 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search customer name or phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No conversations found.
          </div>
        ) : (
          conversations.map((conv: any) => {
            const isSelected = selectedConversation?.id === conv.id;
            const isWA = conv.channel === "WHATSAPP";
            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv)}
                className={`w-full text-left p-3.5 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#FFF1F2] border-l-4 border-[#E11D48]"
                    : "hover:bg-slate-50 border-l-4 border-transparent"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/images.png"
                      alt={conv.customer.name}
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 shadow-xs shrink-0"
                    />
                    <div>
                      <p
                        className={`font-bold text-xs truncate max-w-30 ${isSelected ? "text-[#E11D48]" : "text-slate-800"}`}
                      >
                        {conv.customer.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {conv.customer.phone}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 border ${
                      isWA
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {isWA ? "WhatsApp" : "Web Chat"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 truncate mt-1">
                  {conv.messages && conv.messages.length > 0
                    ? conv.messages[conv.messages.length - 1].content
                    : "No messages yet"}
                </p>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
