'use client';

import React from 'react';
import Image from 'next/image';
import { Conversation } from '@/types';

interface Props {
  conversation: Conversation;
}

export default function ChatHeader({ conversation }: Props) {
  return (
    <div className="p-4 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
      <div className="flex items-center gap-3">
        <Image
          src="/images.png"
          alt={conversation.customer.name}
          width={36}
          height={36}
          className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs"
        />
        <div>
          <h3 className="text-sm font-bold text-[#0F172A]">{conversation.customer.name}</h3>
          <p className="text-[11px] text-slate-400 font-mono">
            {conversation.customer.phone} - {conversation.channel}
          </p>
        </div>
      </div>
      <span className="text-[10px] px-2.5 py-1 rounded-lg font-bold bg-slate-100 text-slate-700 border border-slate-200">
        {conversation.status}
      </span>
    </div>
  );
}
