import { useRef, useEffect } from 'react';
import { Send, Plus, Search, CreditCard, MessageSquare } from 'lucide-react';
import { Conversation } from '@/types/dashboard';

interface Props {
  conversation: Conversation | null;
  replyContent: string;
  sendingMessage: boolean;
  generatingPayment: string | null;
  onReplyChange: (val: string) => void;
  onSend: () => void;
  onCreateBooking: () => void;
  onCheckSlots: () => void;
  onGeneratePaymentLink: (bookingId: string) => void;
}

export default function ChatPanel({ conversation, replyContent, sendingMessage, generatingPayment, onReplyChange, onSend, onCreateBooking, onCheckSlots, onGeneratePaymentLink }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center justify-center h-full space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center">
          <MessageSquare size={20} className="text-violet-500" />
        </div>
        <h3 className="text-sm font-bold text-slate-700">Select a Conversation</h3>
        <p className="text-slate-400 text-xs max-w-xs">Click any conversation from the queue to reply or send payment links.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
        <div>
          <h3 className="text-sm font-bold text-slate-800">{conversation.customer.name}</h3>
          <p className="text-[11px] text-slate-400 font-mono">{conversation.customer.phone} - {conversation.channel}</p>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-lg font-bold bg-slate-100 text-slate-600 border border-slate-200">{conversation.status}</span>
      </div>

      {conversation.bookings && conversation.bookings.length > 0 && (
        <div className="bg-violet-50 p-3 border-b border-violet-100 flex-shrink-0 space-y-2">
          {conversation.bookings.map(b => (
            <div key={b.id} className="p-3 rounded-xl bg-white border border-violet-200 flex justify-between items-center gap-2">
              <div className="text-xs space-y-0.5">
                <p className="text-slate-700"><strong>Slot:</strong> {new Date(b.slotStart).toLocaleString()}</p>
                <p className="text-slate-500">Fee: <strong className="text-slate-800">${b.bookingFee}</strong> | <strong className="text-emerald-600">{b.status}</strong></p>
              </div>
              <button onClick={() => onGeneratePaymentLink(b.id)} disabled={generatingPayment === b.id}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-xl transition disabled:opacity-50 flex items-center gap-1.5">
                <CreditCard size={12} /> {generatingPayment === b.id ? 'Generating...' : 'Send Stripe Link'}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3 min-h-0">
        {conversation.messages.length === 0 && <div className="text-center text-slate-400 text-xs pt-8">No messages yet.</div>}
        {conversation.messages.map(msg => {
          const isCustomer = msg.sender === 'CUSTOMER';
          if (msg.sender === 'SYSTEM') return (
            <div key={msg.id} className="flex justify-center">
              <span className="text-[10px] text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-full">{msg.content}</span>
            </div>
          );
          return (
            <div key={msg.id} className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-sm px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${isCustomer ? 'bg-white border border-slate-200 text-slate-700 rounded-bl-none' : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none'}`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.sentAt && <span className="text-[9px] opacity-50 block text-right mt-1">{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-slate-100 bg-white flex gap-2 flex-shrink-0">
        <input type="text" placeholder="Type response..." value={replyContent} onChange={e => onReplyChange(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && onSend()}
          className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          disabled={sendingMessage} />
        <button onClick={onSend} disabled={sendingMessage || !replyContent.trim()}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold disabled:opacity-40 flex items-center gap-1.5 transition">
          <Send size={13} /> Send
        </button>
      </div>

      <div className="p-3 border-t border-slate-100 bg-white flex gap-2 flex-shrink-0">
        <button onClick={onCheckSlots}
          className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-200 transition flex items-center justify-center gap-1.5">
          <Search size={13} /> Check Slots
        </button>
        <button onClick={onCreateBooking}
          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5">
          <Plus size={13} /> Create Booking
        </button>
      </div>
    </div>
  );
}
