'use client';

import { Conversation, Booking } from '@/types/dashboard';
import { MessageSquare, Send, CalendarDays, CreditCard, Trash2, CheckCircle, Clock } from 'lucide-react';

interface Props {
  conversation: Conversation | null;
  replyContent: string;
  sendingMessage: boolean;
  onReplyChange: (text: string) => void;
  onSend: () => void;
  onOpenBookingModal: () => void;
  onOpenSlotsModal: () => void;
  onGeneratePayment: (bookingId: string) => void;
  generatingPayment: string | null;
  onUpdateStatus: (id: string, status: string) => void;
  onDeleteConversation: (id: string) => void;
}

export default function ChatPanel({
  conversation,
  replyContent,
  sendingMessage,
  onReplyChange,
  onSend,
  onOpenBookingModal,
  onOpenSlotsModal,
  onGeneratePayment,
  generatingPayment,
  onUpdateStatus,
  onDeleteConversation,
}: Props) {
  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-slate-50/50">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-3">
          <MessageSquare size={20} className="text-indigo-600" />
        </div>
        <p className="text-sm font-semibold text-slate-700">No Conversation Selected</p>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Select an intake lead from the queue to review messages, issue slots, and confirm bookings.
        </p>
      </div>
    );
  }

  const isWA = conversation.channel === 'WHATSAPP';
  const bookings: Booking[] = conversation.bookings || [];

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <img
            src="/images.png"
            alt={conversation.customer.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-800">{conversation.customer.name}</h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isWA ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'
                }`}
              >
                {isWA ? 'WhatsApp' : 'Web Chat'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{conversation.customer.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSlotsModal}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Clock size={13} className="text-rose-600" />
            Check Slots
          </button>
          <button
            onClick={onOpenBookingModal}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <CalendarDays size={13} />
            Book Slot
          </button>
          <button
            onClick={() => onDeleteConversation(conversation.id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
            title="Delete Conversation"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Bookings bar inside chat */}
      {bookings.length > 0 && (
        <div className="bg-indigo-50/70 p-3 border-b border-indigo-100 flex-shrink-0 space-y-2">
          {bookings.map((b) => (
            <div key={b.id} className="p-3 rounded-xl bg-white border border-indigo-100 flex justify-between items-center gap-2 shadow-xs">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle size={13} className="text-emerald-500" />
                  Booking Confirmed: {new Date(b.slotStart).toLocaleDateString()} (
                  {new Date(b.slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                  {new Date(b.slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                </p>
                <p className="text-[11px] text-slate-500">
                  Fee: <strong className="text-slate-800">${b.bookingFee}</strong> • Status:{' '}
                  <span className="font-bold text-emerald-600">{b.status}</span>
                </p>
              </div>
              <button
                onClick={() => onGeneratePayment(b.id)}
                disabled={generatingPayment === b.id}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition disabled:opacity-50 flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <CreditCard size={12} />
                {generatingPayment === b.id ? 'Generating...' : 'Payment Link'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/70">
        {conversation.messages.length === 0 ? (
          <div className="text-center text-slate-400 text-xs py-8">No messages in this intake yet.</div>
        ) : (
          conversation.messages.map((m) => {
            const isCustomer = m.sender === 'CUSTOMER';
            return (
              <div key={m.id} className={`flex items-end gap-2 ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                {isCustomer && (
                  <img
                    src="/images.png"
                    alt={conversation.customer.name}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200 shadow-xs flex-shrink-0 mb-0.5"
                  />
                )}
                <div
                  className={`max-w-sm px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    isCustomer
                      ? 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                      : 'bg-indigo-600 text-white rounded-br-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.sentAt && (
                    <span className={`text-[9px] block text-right mt-1 ${isCustomer ? 'text-slate-400' : 'text-indigo-200'}`}>
                      {new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reply input */}
      <div className="p-3 border-t border-slate-200 bg-white flex gap-2">
        <input
          type="text"
          placeholder={`Reply to ${conversation.customer.name}...`}
          value={replyContent}
          onChange={(e) => onReplyChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        <button
          onClick={onSend}
          disabled={sendingMessage || !replyContent.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold disabled:opacity-40 flex items-center gap-1.5 transition shadow-xs cursor-pointer"
        >
          <Send size={13} />
          {sendingMessage ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
