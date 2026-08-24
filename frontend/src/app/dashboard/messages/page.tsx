'use client';

import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { MessageSquare } from 'lucide-react';
import { Conversation, Slot } from '@/types';
import SlotsModal from '@/components/dashboard/modals/SlotsModal';
import PageLoading from '@/components/dashboard/PageLoading';
import {
  CustomerMessages,
  ChatHeader,
  ActiveBookingBanner,
  ChatMessageItem,
  ChatInputBar,
  ChatActionBar,
  CreateBookingModal,
} from '@/components/dashboard/messages';

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
        setSelectedConversation((prev) =>
          prev ? data.find((c) => c.id === prev.id) || prev : prev
        );
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
      const res = await apiClient.post(`/conversations/${selectedConversation.id}/messages`, {
        content,
      });
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
        const startTimeStr = new Date(slotStart).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        const endTimeStr = new Date(slotEnd).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
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
      const res = await apiClient.get(
        '/bookings/slots/available?traderId=' + traderId + '&date=' + dateToFetch
      );
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

  if (loading) {
    return <PageLoading text="Loading customer messages..." />;
  }

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden min-h-0">
      {/* 1. Left Queue: Customer Messages */}
      <CustomerMessages
        conversations={conversations}
        selectedConversation={selectedConversation}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isRefreshing={isRefreshing}
        onRefresh={refreshAll}
        onSelectConversation={setSelectedConversation}
        onUpdateStatus={handleUpdateConversationStatus}
        onDeleteConversation={handleDeleteConversation}
      />

      {/* 2. Right Panel: Active Chat View */}
      <div className="lg:col-span-7 h-full overflow-hidden">
        {selectedConversation ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
            {/* Chat Top Header */}
            <ChatHeader conversation={selectedConversation} />

            {/* Active Booking Banner */}
            <ActiveBookingBanner
              conversation={selectedConversation}
              generatingPayment={generatingPayment}
              onGeneratePaymentLink={handleGeneratePaymentLink}
              onChangeSlot={() => {
                setBookingError('');
                setShowBookingModal(true);
              }}
            />

            {/* Messages Stream */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3 min-h-0">
              {selectedConversation.messages.length === 0 && (
                <div className="text-center text-slate-400 text-xs pt-8">No messages yet.</div>
              )}

              {selectedConversation.messages.map((msg) => (
                <ChatMessageItem key={msg.id} msg={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Response Typing Bar */}
            <ChatInputBar
              replyContent={replyContent}
              onReplyChange={setReplyContent}
              sendingMessage={sendingMessage}
              onSendMessage={handleSendMessage}
            />

            {/* Bottom Actions Bar */}
            <ChatActionBar
              onCheckSlots={() => {
                handleFetchSlots();
                setShowSlotsModal(true);
              }}
              onCreateBooking={() => {
                setBookingError('');
                setShowBookingModal(true);
              }}
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center justify-center h-full space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
              <MessageSquare size={20} className="text-[#E11D48]" />
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">Select a Conversation</h3>
            <p className="text-slate-400 text-xs max-w-xs">
              Click any conversation from the list to reply or send payment links.
            </p>
          </div>
        )}
      </div>

      {/* 3. Modals */}
      {showBookingModal && (
        <CreateBookingModal
          selectedConversation={selectedConversation}
          bookingDate={bookingDate}
          onBookingDateChange={setBookingDate}
          startTime={startTime}
          onStartTimeChange={setStartTime}
          endTime={endTime}
          onEndTimeChange={setEndTime}
          bookingFee={bookingFee}
          onBookingFeeChange={setBookingFee}
          bookingError={bookingError}
          creatingBooking={creatingBooking}
          onSubmit={handleCreateBooking}
          onClose={() => setShowBookingModal(false)}
        />
      )}

      {showSlotsModal && (
        <SlotsModal
          slotsDate={slotsDate}
          availableSlots={availableSlots}
          loadingSlots={loadingSlots}
          onDateChange={setSlotsDate}
          onFetch={(dateStr) => handleFetchSlots(dateStr)}
          onSelectSlot={(slot: Slot) => {
            const s = new Date(slot.start),
              e = new Date(slot.end);
            const pad = (n: number) => n.toString().padStart(2, '0');
            setBookingDate(s.getFullYear() + '-' + pad(s.getMonth() + 1) + '-' + pad(s.getDate()));
            setStartTime(pad(s.getHours()) + ':' + pad(s.getMinutes()));
            setEndTime(pad(e.getHours()) + ':' + pad(e.getMinutes()));
            if (!selectedConversation && conversations.length > 0)
              setSelectedConversation(conversations[0]);
            setShowSlotsModal(false);
            setShowBookingModal(true);
          }}
          onClose={() => setShowSlotsModal(false)}
        />
      )}
    </div>
  );
}
