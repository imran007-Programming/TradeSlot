'use client';

import React from 'react';
import { Send } from 'lucide-react';

interface Props {
  replyContent: string;
  onReplyChange: (content: string) => void;
  sendingMessage: boolean;
  onSendMessage: () => void;
}

export default function ChatInputBar({
  replyContent,
  onReplyChange,
  sendingMessage,
  onSendMessage,
}: Props) {
  const inputCls =
    'w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

  return (
    <div className="p-3 border-t border-slate-100 bg-white flex gap-2 flex-shrink-0">
      <input
        type="text"
        placeholder="Type response..."
        value={replyContent}
        onChange={(e) => onReplyChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
        className={inputCls}
        disabled={sendingMessage}
      />
      <button
        onClick={onSendMessage}
        disabled={sendingMessage || !replyContent.trim()}
        className="bg-[#E11D48] hover:bg-[#BE123C] text-white px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
      >
        <Send size={13} /> Send
      </button>
    </div>
  );
}
