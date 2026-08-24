'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { DatePicker } from '@/components/ui/date-picker';
import SlotsModal from '@/components/dashboard/modals/SlotsModal';
import {
  MessageSquare, CalendarDays, RefreshCw, CreditCard, Search, Send, Plus, Trash2, CheckCircle,
  Clock, ExternalLink, Car, ShieldCheck
} from 'lucide-react';
import { Conversation, Slot } from '@/types';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [user, setUser] = useState<any>(null);
  const [replyContent, setReplyContent] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [bookingFee, setBookingFee] = useState('50');
  const [creatingBooking, setCreatingBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [generatingPayment, setGeneratingPayment] = useState<string | null>(null);
  const [showSlotsModal, setShowSlotsModal] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<Array<{ start: string; end: string }>>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsDate, setSlotsDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    try {
      const res = await apiClient.get('/conversations');
      if (res.success) {
        const data: Conversation[] = res.data || [];
        setConversations(data);
        setSelectedConversation(prev => prev ? (data.find(c => c.id === prev.id) || prev) : prev);
      }
    } catch {}
  };

  const fetchUserData = async () => {
    try {
      const res = await apiClient.get('/auth/me');
      if (res.success && res.data) {
        setUser(res.data);
      }
    } catch {}
  };

  const refreshAll = async () => {
    setIsRefreshing(true);
    try {
      await fetchConversations();
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.allSettled([fetchUserData(), fetchConversations()]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(fetchConversations, 4000);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  const handleSendMessage = async () => {
    if (!replyContent.trim() || !selectedConversation) return;
    const content = replyContent.trim();
    setReplyContent('');
    setSendingMessage(true);
    try {
      const res = await apiClient.post(`/conversations/${selectedConversation.id}/messages`, { content });
      if (res.success) {
        await fetchConversations();
      } else {
        setReplyContent(content);
        toast.error(res.message || 'Failed to send');
      }
    } catch (err: any) {
      setReplyContent(content);
      toast.error(err.message);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation) return;
    setCreatingBooking(true);
    setBookingError('');
    try {
      const slotStart = new Date(`${bookingDate}T${startTime}:00`).toISOString();
      const slotEnd = new Date(`${bookingDate}T${endTime}:00`).toISOString();
      const res = await apiClient.post('/bookings/from-conversation', {
        conversationId: selectedConversation.id,
        slotStart,
        slotEnd,
        bookingFee: parseFloat(bookingFee),
      });
      if (res.success && res.data) {
        setShowBookingModal(false);
        const formattedDate = new Date(slotStart).toLocaleDateString([], {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        const startTimeStr = new Date(slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const endTimeStr = new Date(slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        await apiClient.post(`/conversations/${selectedConversation.id}/messages`, {
          content: `Booking Offer: ${formattedDate} (${startTimeStr} - ${endTimeStr}) (Fee: $${bookingFee}) [ID: ${res.data.id}]`,
        });
        await fetchConversations();
        toast.success('Slot proposal sent to customer! Awaiting customer confirmation.');
        window.dispatchEvent(new Event('dashboard:refresh'));
      } else {
        const msg = res.message || 'Failed to create booking';
        setBookingError(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      const msg = err.message || 'Error creating booking';
      setBookingError(msg);
      toast.error(msg);
    } finally {
      setCreatingBooking(false);
    }
  };

  const handleGeneratePaymentLink = async (bookingId: string) => {
    setGeneratingPayment(bookingId);
    try {
      const res = await apiClient.post('/payments/checkout/' + bookingId);
      if (res.success && res.data?.checkoutUrl) {
        if (selectedConversation) {
          await apiClient.post('/conversations/' + selectedConversation.id + '/messages', {
            content: 'Payment Link: ' + res.data.checkoutUrl,
          });
          await fetchConversations();
          toast.success('Payment link sent to customer!');
        } else {
          toast.info('Payment link:\n\n' + res.data.checkoutUrl);
        }
      } else {
        toast.error(res.message || 'Failed to generate payment link');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setGeneratingPayment(null);
    }
  };

  const handleFetchSlots = async (targetDate?: string) => {
    if (!user?.trader?.id && !selectedConversation?.traderId) return;
    setLoadingSlots(true);
    try {
      const dateToFetch = targetDate || slotsDate;
      const traderId = user?.trader?.id || selectedConversation?.traderId;
      const res = await apiClient.get('/bookings/slots/available?traderId=' + traderId + '&date=' + dateToFetch);
      if (res.success) {
        setAvailableSlots(res.data || []);
      } else {
        setAvailableSlots([]);
        toast.error(res.message || 'Could not fetch slots');
      }
    } catch (err: any) {
      setAvailableSlots([]);
      toast.error(err.message || 'Error fetching slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleUpdateConversationStatus = async (convId: string, status: string) => {
    try {
      const res = await apiClient.patch('/conversations/' + convId + '/status', { status });
      if (res.success) {
        toast.success('Conversation status updated!');
        await fetchConversations();
      } else {
        toast.error(res.message || 'Failed to update conversation status');
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteConversation = (convId: string) => {
    toast('Delete this conversation?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            const res = await apiClient.delete(`/conversations/${convId}`);
            if (res.success) {
              toast.success('Conversation deleted!');
              if (selectedConversation?.id === convId) setSelectedConversation(null);
              await fetchConversations();
              window.dispatchEvent(new Event('dashboard:refresh'));
            } else {
              toast.error(res.message || 'Failed to delete conversation');
            }
          } catch (err: any) {
            toast.error(err.message);
          }
        },
      },
      cancel: { label: 'Cancel', onClick: () => {} },
    });
  };

  const filteredConversations = conversations.filter(c =>
    c.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.customer.phone.includes(searchTerm)
  );

  const inputCls = "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden min-h-0">
      {/* Intake Queue Sidebar */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-4 border-b border-slate-100 space-y-2 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-[#0F172A]">Intake Queue</h2>
            <button
              onClick={refreshAll}
              disabled={isRefreshing}
              className="text-xs font-semibold text-[#E11D48] hover:text-[#BE123C] flex items-center gap-1.5 transition cursor-pointer disabled:opacity-60"
            >
              <RefreshCw size={12} className={isRefreshing ? "animate-spin text-[#E11D48]" : "transition-transform hover:rotate-180 duration-500"} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search name or phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
        <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No conversations found</div>
          ) : filteredConversations.map(conv => {
            const isSelected = selectedConversation?.id === conv.id;
            const isWA = conv.channel === 'WHATSAPP';
            return (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full text-left p-3.5 transition-all cursor-pointer ${
                  isSelected ? 'bg-[#FFF1F2] border-l-4 border-[#E11D48]' : 'hover:bg-slate-50 border-l-4 border-transparent'
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
                      <h4 className="font-bold text-[#0F172A] text-xs truncate">{conv.customer.name}</h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">{conv.customer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <select
                      value={conv.status}
                      onChange={e => {
                        e.stopPropagation();
                        handleUpdateConversationStatus(conv.id, e.target.value);
                      }}
                      onClick={e => e.stopPropagation()}
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 focus:outline-none"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="BOOKED">BOOKED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                    <button
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleDeleteConversation(conv.id);
                      }}
                      className="text-slate-400 hover:text-red-500 transition p-0.5 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 border ${isWA ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                    <MessageSquare size={10} /> {isWA ? 'WhatsApp' : 'Web Chat'}
                  </span>
                  <span className="text-slate-400 text-[10px]">{conv.messages.length} msgs</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Conversation & Chat View */}
      <div className="lg:col-span-7 h-full overflow-hidden">
        {selectedConversation ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                <Image
                  src="/images.png"
                  alt={selectedConversation.customer.name}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">{selectedConversation.customer.name}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">{selectedConversation.customer.phone} - {selectedConversation.channel}</p>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-lg font-bold bg-slate-100 text-slate-700 border border-slate-200">{selectedConversation.status}</span>
            </div>

            {(() => {
              const activeBookings = (selectedConversation.bookings || []).filter(b => b.status !== 'CANCELLED');
              if (activeBookings.length === 0) return null;

              const confirmedBooking = activeBookings.find(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED');
              const pendingBooking = activeBookings.find(b => b.status === 'PENDING');

              if (confirmedBooking) {
                const isPaid = confirmedBooking.payment?.status === 'SUCCEEDED';
                return (
                  <div className="bg-emerald-50/60 border-b border-emerald-200/80 px-4 py-3 flex-shrink-0">
                    <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0 font-bold">
                          <CheckCircle size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-[#0F172A] truncate">
                              Confirmed: {new Date(confirmedBooking.slotStart).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {confirmedBooking.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {new Date(confirmedBooking.slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(confirmedBooking.slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Fee: <strong className="text-slate-800">${confirmedBooking.bookingFee}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isPaid ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-xs">
                            <CheckCircle size={13} className="text-emerald-600" /> Paid
                          </span>
                        ) : (
                          <button
                            onClick={() => handleGeneratePaymentLink(confirmedBooking.id)}
                            disabled={generatingPayment === confirmedBooking.id}
                            className="bg-[#0F172A] hover:bg-[#1E293B] active:scale-98 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition disabled:opacity-50 flex items-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer"
                          >
                            <CreditCard size={13} />
                            <span>{generatingPayment === confirmedBooking.id ? 'Generating...' : 'Send Stripe Link'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              if (pendingBooking) {
                return (
                  <div className="bg-amber-50/70 border-b border-amber-200/80 px-4 py-2.5 flex-shrink-0">
                    <div className="flex items-center justify-between text-xs text-amber-900 bg-white px-3 py-2 rounded-xl border border-amber-200 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Clock size={15} className="text-amber-600" />
                        <span className="font-semibold">
                          Slot Proposed: {new Date(pendingBooking.slotStart).toLocaleDateString([], { month: 'short', day: 'numeric' })} ({new Date(pendingBooking.slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(pendingBooking.slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                        </span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                          Awaiting Customer
                        </span>
                      </div>
                      <button
                        onClick={() => { setBookingError(''); setShowBookingModal(true); }}
                        className="text-[11px] font-bold text-[#E11D48] hover:underline cursor-pointer ml-2"
                      >
                        Change Slot
                      </button>
                    </div>
                  </div>
                );
              }

              return null;
            })()}

            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3 min-h-0">
              {selectedConversation.messages.length === 0 && <div className="text-center text-slate-400 text-xs pt-8">No messages yet.</div>}

              {selectedConversation.messages.map(msg => {
                const isCustomer = msg.sender === 'CUSTOMER';
                if (msg.sender === 'SYSTEM') return (
                  <div key={msg.id} className="flex justify-center">
                    <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full font-medium">{msg.content}</span>
                  </div>
                );
                return (
                  <div key={msg.id} className={`flex items-end gap-2 ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                    {isCustomer && (
                      <Image
                        src="/images.png"
                        alt="Customer"
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200 shadow-xs flex-shrink-0 mb-0.5"
                      />
                    )}
                    {msg.content.toLowerCase().startsWith('booking confirmed:') || msg.content.toLowerCase().startsWith('booking offer:') ? (
                      (() => {
                        const content = msg.content;
                        const isConfirmed = content.toLowerCase().startsWith('booking confirmed:');
                        const feeMatch = content.match(/Fee:\s*\$([\d.]+)/i);
                        const fee = feeMatch ? feeMatch[1] : '50';
                        const timeMatch = content.match(/\((\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))\)/i);
                        const timeStr = timeMatch ? timeMatch[1] : null;

                        let cleaned = content
                          .replace(/Booking (Offer|Proposed|Confirmed):\s*/i, '')
                          .replace(/\(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\)/i, '')
                          .replace(/\(Fee:\s*\$[\d.]+\)/i, '')
                          .replace(/\[ID:\s*[a-zA-Z0-9_-]+\]/i, '')
                          .trim();

                        const dateStr = cleaned || 'Scheduled Date';

                        return (
                          <div className="max-w-sm rounded-2xl overflow-hidden bg-white shadow-lg border border-slate-100 text-[#0F172A]">
                            <div className={`px-3.5 py-2 text-white flex items-center justify-between ${
                              isConfirmed ? 'bg-gradient-to-r from-emerald-600 to-teal-700' : 'bg-gradient-to-r from-[#E11D48] to-[#BE123C]'
                            }`}>
                              <span className="font-bold text-xs flex items-center gap-1.5">
                                {isConfirmed ? <CheckCircle size={14} /> : <CalendarDays size={14} />}
                                <span>{isConfirmed ? 'Booking Confirmed' : 'Booking Offer'}</span>
                              </span>
                              <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-white">
                                {isConfirmed ? 'Confirmed' : 'Pending'}
                              </span>
                            </div>
                            <div className="p-3.5 space-y-2 text-xs bg-white">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-slate-700">
                                  <span className="font-bold text-slate-400 text-[11px]">Date:</span>
                                  <span className="font-bold text-[#0F172A]">{dateStr}</span>
                                </div>
                                {timeStr && (
                                  <div className="flex items-center gap-1.5 text-slate-700">
                                    <span className="font-bold text-slate-400 text-[11px]">Time:</span>
                                    <span className="font-bold text-[#E11D48]">{timeStr}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1.5 text-slate-700">
                                  <span className="font-bold text-slate-400 text-[11px]">Fee:</span>
                                  <span className="font-bold text-slate-900">${fee}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-[11px] bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-xl">
                                <span className="text-slate-600 flex items-center gap-1.5">
                                  <Car size={13} className="text-slate-500" />
                                  <span>Travel Buffer (30m):</span>
                                </span>
                                <span className="font-bold text-emerald-600">Applied</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    ) : (() => {
                      const url = msg.content.match(/(https?:\/\/[^\s]+)/)?.[0];
                      const isPayment = (msg.content.toLowerCase().includes('payment link') || msg.content.toLowerCase().includes('stripe.com')) && !!url;

                      if (isPayment && url) {
                        return (
                          <div className="max-w-sm rounded-2xl overflow-hidden bg-white shadow-lg border border-slate-100 text-[#0F172A]">
                            <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] px-3.5 py-2 text-white flex items-center justify-between">
                              <span className="font-bold text-xs flex items-center gap-1.5">
                                <CreditCard size={14} className="text-[#E11D48]" />
                                <span>Stripe Payment Link Sent</span>
                              </span>
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                Active
                              </span>
                            </div>
                            <div className="p-3.5 space-y-2.5 bg-white text-xs">
                              <p className="text-slate-600 leading-relaxed font-medium">
                                Direct payment link sent to customer.
                              </p>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-2.5 px-3 bg-[#E11D48] hover:bg-[#BE123C] active:scale-98 text-white font-bold rounded-xl shadow-xs transition text-center flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <span>Open Stripe Checkout</span>
                                <ExternalLink size={13} />
                              </a>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
                                <span className="flex items-center gap-1 text-slate-500 font-medium">
                                  <ShieldCheck size={13} className="text-emerald-500" /> Stripe Protected
                                </span>
                                <span className="font-mono text-[9px] text-slate-400">100% Encrypted</span>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div className={`max-w-sm px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isCustomer ? 'bg-white border border-slate-200 text-[#0F172A] rounded-bl-none shadow-xs' : 'bg-[#E11D48] text-white rounded-br-none shadow-xs'
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          {msg.sentAt && <span className="text-[9px] opacity-60 block text-right mt-1">{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>}
                        </div>
                      );
                    })()}
                    {!isCustomer && (
                      <div className="w-6 h-6 rounded-full bg-[#BE123C] text-white flex items-center justify-center text-[9px] font-bold shadow-xs flex-shrink-0 mb-0.5">
                        You
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-slate-100 bg-white flex gap-2 flex-shrink-0">
              <input
                type="text"
                placeholder="Type response..."
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                className={inputCls}
                disabled={sendingMessage}
              />
              <button
                onClick={handleSendMessage}
                disabled={sendingMessage || !replyContent.trim()}
                className="bg-[#E11D48] hover:bg-[#BE123C] text-white px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Send size={13} /> Send
              </button>
            </div>

            <div className="p-3 border-t border-slate-100 bg-white flex gap-2 flex-shrink-0">
              <button
                onClick={() => { handleFetchSlots(); setShowSlotsModal(true); }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Search size={13} className="text-[#E11D48]" /> Check Slots
              </button>
              <button
                onClick={() => { setBookingError(''); setShowBookingModal(true); }}
                className="flex-1 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus size={13} /> Create Booking
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center justify-center h-full space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
              <MessageSquare size={20} className="text-[#E11D48]" />
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">Select a Conversation</h3>
            <p className="text-slate-400 text-xs max-w-xs">Click any conversation from the queue to reply or send payment links.</p>
          </div>
        )}
      </div>

      {/* CREATE BOOKING MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-[#0F172A]">
            <h3 className="text-base font-bold text-[#0F172A]">
              Create Booking {selectedConversation ? 'for ' + selectedConversation.customer.name : ''}
            </h3>
            {bookingError && <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl">{bookingError}</div>}
            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Booking Date</label>
                <DatePicker value={bookingDate} onChange={setBookingDate} placeholder="Select booking date" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className={inputCls} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Time</label>
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className={inputCls} required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Booking Fee ($)</label>
                <input type="number" step="0.01" value={bookingFee} onChange={e => setBookingFee(e.target.value)} className={inputCls} required />
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingBooking}
                  className="px-5 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl text-xs font-bold disabled:opacity-50 transition shadow-sm cursor-pointer"
                >
                  {creatingBooking ? 'Creating...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SLOTS / SCHEDULE MODAL */}
      {showSlotsModal && (
        <SlotsModal
          slotsDate={slotsDate}
          availableSlots={availableSlots}
          loadingSlots={loadingSlots}
          onDateChange={setSlotsDate}
          onFetch={(dateStr) => handleFetchSlots(dateStr)}
          onSelectSlot={(slot: Slot) => {
            const s = new Date(slot.start), e = new Date(slot.end);
            const pad = (n: number) => n.toString().padStart(2, '0');
            setBookingDate(s.getFullYear() + '-' + pad(s.getMonth() + 1) + '-' + pad(s.getDate()));
            setStartTime(pad(s.getHours()) + ':' + pad(s.getMinutes()));
            setEndTime(pad(e.getHours()) + ':' + pad(e.getMinutes()));
            if (!selectedConversation && conversations.length > 0) setSelectedConversation(conversations[0]);
            setShowSlotsModal(false);
            setShowBookingModal(true);
          }}
          onClose={() => setShowSlotsModal(false)}
        />
      )}
    </div>
  );
}
