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
        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
          <MessageSquare size={20} className="text-[#0F172A]" />
        </div>
        <p className="text-sm font-bold text-[#0F172A]">No Conversation Selected</p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
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
              <h3 className="font-black text-sm text-[#0F172A]">{conversation.customer.name}</h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isWA ? 'bg-[#F4FEE5] text-[#0F172A] border-[#84EA00]' : 'bg-slate-100 text-[#0F172A] border-slate-200'
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
            className="px-3.5 py-1.5 rounded-xl bg-[#84EA00] hover:bg-[#74D100] text-[#0F172A] text-xs font-black flex items-center gap-1.5 transition shadow-xs cursor-pointer border border-[#84EA00]"
          >
            <Clock size={13} className="text-[#0F172A]" />
            Check Slots
          </button>
          <button
            onClick={onOpenBookingModal}
            className="px-3.5 py-1.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <CalendarDays size={13} className="text-[#84EA00]" />
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
        <div className="bg-[#F4FEE5] p-3 border-b border-[#84EA00]/30 flex-shrink-0 space-y-2">
          {bookings.map((b) => (
            <div key={b.id} className="p-3 rounded-xl bg-white border border-[#84EA00]/40 flex justify-between items-center gap-2 shadow-xs">
              <div className="space-y-0.5">
                <p className="text-xs font-black text-[#0F172A] flex items-center gap-1.5">
                  <CheckCircle size={13} className="text-[#84EA00]" />
                  Booking Confirmed: {new Date(b.slotStart).toLocaleDateString()} (
                  {new Date(b.slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                  {new Date(b.slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                </p>
                <p className="text-[11px] text-slate-600">
                  Fee: <strong className="text-[#0F172A]">${b.bookingFee}</strong> • Status:{' '}
                  <span className="font-bold text-[#0F172A] bg-[#F4FEE5] px-1.5 py-0.5 rounded border border-[#84EA00]">{b.status}</span>
                </p>
              </div>
              <button
                onClick={() => onGeneratePayment(b.id)}
                disabled={generatingPayment === b.id}
                className="bg-[#0F172A] hover:bg-[#1E293B] text-[#84EA00] text-xs font-black px-3 py-2 rounded-xl transition disabled:opacity-50 flex items-center gap-1.5 shadow-xs cursor-pointer border border-[#0F172A]"
              >
                <CreditCard size={12} />
                {generatingPayment === b.id ? 'Generating...' : 'Payment Link'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
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
                      ? 'bg-white border border-slate-200 text-[#0F172A] rounded-bl-none shadow-xs'
                      : 'bg-[#0F172A] text-white rounded-br-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.sentAt && (
                    <span className={`text-[9px] block text-right mt-1 ${isCustomer ? 'text-slate-400' : 'text-slate-400'}`}>
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
          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#84EA00]/30"
        />
        <button
          onClick={onSend}
          disabled={sendingMessage || !replyContent.trim()}
          className="bg-[#0F172A] hover:bg-[#1E293B] text-[#84EA00] px-4 py-2.5 rounded-xl text-xs font-black disabled:opacity-40 flex items-center gap-1.5 transition shadow-xs cursor-pointer"
        >
          <Send size={13} />
          {sendingMessage ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
