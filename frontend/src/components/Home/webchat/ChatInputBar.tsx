'use client';

import React from 'react';

interface Props {
  input: string;
  setInput: (v: string) => void;
  loading: boolean;
  onSend: () => void;
}

export default function ChatInputBar({ input, setInput, loading, onSend }: Props) {
  return (
    <div className="border-t border-slate-200 p-3 flex gap-2 bg-white flex-shrink-0">
      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSend()}
        className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/20 transition"
        disabled={loading}
      />
      <button
        onClick={onSend}
        disabled={loading || !input.trim()}
        className="bg-[#E11D48] hover:bg-[#BE123C] text-white px-4 py-2.5 rounded-xl disabled:opacity-50 transition font-bold text-xs cursor-pointer shadow-sm"
      >
        Send
      </button>
    </div>
  );
}
