'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { getCookie, deleteCookie } from '@/lib/cookies';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  MessageSquare, CalendarDays, Users, MapPin, Zap, LogOut,
  RefreshCw, CreditCard, Search, Send, Plus, Trash2, CheckCircle,
  Clock, BarChart3
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: string;
  sentAt?: string;
}

interface Booking {
  id: string;
  slotStart: string;
  slotEnd: string;
  bookingFee: string;
  status: string;
  bufferMinutes: number;
  customer?: { name: string; phone: string; };
  traderId?: string;
  conversationId?: string;
}

interface WorkArea {
  id: string;
  availableDate: string;
  area: string;
}

interface Conversation {
  id: string;
  customerId: string;
  traderId: string;
  channel: string;
  status: string;
  customer: { name: string; phone: string; };
  messages: Message[];
  bookings?: Booking[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'messages' | 'bookings' | 'customers' | 'workareas'>('messages');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [workAreas, setWorkAreas] = useState<WorkArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [user, setUser] = useState<any>(null);
  const [stripeStatus, setStripeStatus] = useState<{ connected: boolean; onboardingComplete: boolean }>({ connected: false, onboardingComplete: false });
  const [connectingStripe, setConnectingStripe] = useState(false);
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
  const [showWorkAreaModal, setShowWorkAreaModal] = useState(false);
  const [workAreaDate, setWorkAreaDate] = useState(new Date().toISOString().split('T')[0]);
  const [workAreaName, setWorkAreaName] = useState('');
  const [settingWorkArea, setSettingWorkArea] = useState(false);
  const [workAreaMessage, setWorkAreaMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(fetchConversations, 4000);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  useEffect(() => {
    const token = getCookie('accessToken');
    const init = async () => {
      try {
        const res = await apiClient.get('/auth/me');
        if (res.success && res.data) { setUser(res.data); await refreshAll(); }
        else if (!token) router.push('/');
        else await refreshAll();
      } catch { if (!token) router.push('/'); }
      finally { setLoading(false); }
    };
    init();
  }, [router]);

  const refreshAll = async () => {
    await Promise.all([fetchConversations(), fetchBookings(), fetchWorkAreas(), checkStripe()]);
  };

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

  const fetchBookings = async () => {
    try { const res = await apiClient.get('/bookings'); if (res.success) setBookings(res.data || []); } catch {}
  };

  const fetchWorkAreas = async () => {
    try { const res = await apiClient.get('/work-area'); if (res.success) setWorkAreas(res.data || []); } catch {}
  };

  const checkStripe = async () => {
    try {
      const res = await apiClient.get('/traders/stripe/status');
      if (res.success && res.data) setStripeStatus({ connected: res.data.connected, onboardingComplete: res.data.onboardingComplete });
    } catch {}
  };

  const handleConnectStripe = async () => {
    setConnectingStripe(true);
    try {
      const res = await apiClient.post('/traders/stripe/connect');
      if (res.success && res.data?.onboardingUrl) {
        const popup = window.open(res.data.onboardingUrl, '_blank');
        const timer = setInterval(() => {
          if (popup?.closed) { clearInterval(timer); checkStripe(); }
        }, 1000);
      }
      else toast.error(res.message || 'Failed to generate Stripe link');
    } catch (err: any) { toast.error(err.message); }
    finally { setConnectingStripe(false); }
  };

  const handleResetStripe = async () => {
    if (!confirm('Reset your Stripe connection?')) return;
    try {
      const res = await apiClient.post('/traders/stripe/reset');
      if (res.success) { setStripeStatus({ connected: false, onboardingComplete: false }); toast.success('Stripe reset done!'); }
    } catch (err: any) { toast.error(err.message); }
  };

  const handleLogout = async () => {
    try { await apiClient.post('/auth/logout'); } catch {}
    deleteCookie('accessToken'); deleteCookie('refreshToken'); router.push('/');
  };

  const handleSendMessage = async () => {
    if (!replyContent.trim() || !selectedConversation) return;
    const content = replyContent.trim();
    setReplyContent(''); setSendingMessage(true);
    try {
      const res = await apiClient.post(`/conversations/${selectedConversation.id}/messages`, { content });
      if (res.success) await fetchConversations();
      else { setReplyContent(content); toast.error(res.message || 'Failed to send'); }
    } catch (err: any) { setReplyContent(content); toast.error(err.message); }
    finally { setSendingMessage(false); }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation) return;
    setCreatingBooking(true); setBookingError('');
    try {
      const slotStart = new Date(`${bookingDate}T${startTime}:00`).toISOString();
      const slotEnd = new Date(`${bookingDate}T${endTime}:00`).toISOString();
      const res = await apiClient.post('/bookings/from-conversation', {
        conversationId: selectedConversation.id, slotStart, slotEnd, bookingFee: parseFloat(bookingFee),
      });
      if (res.success) {
        setShowBookingModal(false);
        await apiClient.post(`/conversations/${selectedConversation.id}/messages`, {
          content: 'Booking Confirmed: ' + new Date(slotStart).toLocaleString() + ' (Fee: $' + bookingFee + ')',
        });
        await refreshAll(); toast.success('Booking created!');
      } else setBookingError(res.message || 'Failed to create booking');
    } catch (err: any) { setBookingError(err.message); }
    finally { setCreatingBooking(false); }
  };

  const handleGeneratePaymentLink = async (bookingId: string) => {
    setGeneratingPayment(bookingId);
    try {
      const res = await apiClient.post('/payments/checkout/' + bookingId);
      if (res.success && res.data?.checkoutUrl) {
        if (selectedConversation) {
          await apiClient.post('/conversations/' + selectedConversation.id + '/messages', { content: 'Payment Link: ' + res.data.checkoutUrl });
          await fetchConversations(); toast.success('Payment link sent!');
        } else toast.info('Payment link:\n\n' + res.data.checkoutUrl);
      } else toast.error(res.message || 'Failed to generate link');
    } catch (err: any) { toast.error(err.message); }
    finally { setGeneratingPayment(null); }
  };

  const handleFetchSlots = async () => {
    if (!user?.trader?.id && !selectedConversation?.traderId) return;
    setLoadingSlots(true);
    try {
      const traderId = user?.trader?.id || selectedConversation?.traderId;
      const res = await apiClient.get('/bookings/slots/available?traderId=' + traderId + '&date=' + slotsDate);
      if (res.success) setAvailableSlots(res.data || []);
      else toast.error(res.message || 'Could not fetch slots');
    } catch (err: any) { toast.error(err.message); }
    finally { setLoadingSlots(false); }
  };

  const handleSetWorkArea = async (e: React.FormEvent) => {
    e.preventDefault(); setSettingWorkArea(true); setWorkAreaMessage('');
    try {
      const res = await apiClient.post('/work-area/set-area', { availableDate: workAreaDate, area: workAreaName });
      if (res.success) { setWorkAreaMessage('Saved!'); setWorkAreaName(''); await fetchWorkAreas(); }
      else setWorkAreaMessage(res.message || 'Failed');
    } catch (err: any) { setWorkAreaMessage(err.message); }
    finally { setSettingWorkArea(false); }
  };

  const handleDeleteWorkArea = async (id: string) => {
    if (!confirm('Delete this work area?')) return;
    try { const res = await apiClient.delete('/work-area/' + id); if (res.success) await fetchWorkAreas(); }
    catch (err: any) { toast.error(err.message); }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const res = await apiClient.patch('/bookings/' + bookingId + '/status', { status });
      if (res.success) {
        toast.success('Booking status updated!');
        await fetchBookings();
      } else {
        toast.error(res.message || 'Failed to update booking status');
      }
    } catch (err: any) { toast.error(err.message); }
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
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDeleteConversation = async (convId: string) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;
    try {
      const res = await apiClient.delete(`/conversations/${convId}`);
      if (res.success) {
        toast.success('Conversation deleted!');
        if (selectedConversation?.id === convId) setSelectedConversation(null);
        await fetchConversations();
      } else {
        toast.error(res.message || 'Failed to delete conversation');
      }
    } catch (err: any) { toast.error(err.message); }
  };

  const allCustomers = Array.from(
    new Map(conversations.map(c => [c.customerId, {
      id: c.customerId, name: c.customer.name, phone: c.customer.phone,
      channel: c.channel, totalMessages: c.messages.length,
      bookingsCount: (c.bookings || []).length, status: c.status,
    }])).values()
  );

  const filteredConversations = conversations.filter(c =>
    c.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.customer.phone.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 animate-pulse mx-auto flex items-center justify-center shadow-xl">
            <Zap size={22} className="text-white" />
          </div>
          <p className="text-slate-500 font-semibold text-sm">Loading TradeSlot...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { tab: 'messages' as const, icon: <MessageSquare size={15} />, label: 'Messages', count: conversations.length },
    { tab: 'bookings' as const, icon: <CalendarDays size={15} />, label: 'Bookings', count: bookings.length },
    { tab: 'customers' as const, icon: <Users size={15} />, label: 'Customers', count: allCustomers.length },
    { tab: 'workareas' as const, icon: <MapPin size={15} />, label: 'Work Areas', count: workAreas.length },
  ];

  const inputCls = "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100";

  return (
    <div className="h-screen w-screen bg-slate-50 text-slate-800 flex flex-col overflow-hidden" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>

      {/* Navbar */}
      <header className="h-14 bg-white border-b border-slate-200 px-5 flex items-center justify-between flex-shrink-0 z-30 shadow-sm">
        <div className="flex items-center space-x-3">
          <Link href="/" className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-md shadow-violet-200">
            <Zap size={15} className="text-white" />
          </Link>
          <h1 className="text-sm font-bold text-slate-800 tracking-tight">TradeSlot</h1>
          <span className="text-[10px] bg-violet-100 text-violet-600 border border-violet-200 px-1.5 py-0.5 rounded-md uppercase tracking-widest font-bold">Pro</span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setShowWorkAreaModal(true)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 transition flex items-center gap-1.5">
            <MapPin size={13} /> Set Work Area
          </button>
          {stripeStatus.onboardingComplete ? (
            <div className="flex items-center gap-1.5">
              <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
                <CreditCard size={13} /> Stripe Active
              </span>
              <button onClick={handleResetStripe} className="bg-slate-100 border border-slate-200 hover:border-red-300 text-slate-500 hover:text-red-500 px-2 py-1.5 rounded-lg transition" title="Reset Stripe">
                <RefreshCw size={13} />
              </button>
            </div>
          ) : (
            <button onClick={handleConnectStripe} disabled={connectingStripe} className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 transition shadow-md shadow-violet-200 flex items-center gap-1.5">
              <CreditCard size={13} /> {connectingStripe ? 'Connecting...' : 'Connect Stripe'}
            </button>
          )}
          <div className="h-5 w-px bg-slate-200 mx-1" />
          <span className="text-xs text-slate-400 font-mono">{user?.phone}</span>
          <button onClick={handleLogout} className="bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-200 transition flex items-center gap-1.5">
            <LogOut size={13} /> Logout
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden w-full">

        {/* Sidebar */}
        <aside className="w-52 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 h-full py-5 px-3 shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Navigation</p>
            {navItems.map(({ tab, icon, label, count }) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab ? 'bg-violet-50 text-violet-700 border border-violet-200 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'
                }`}>
                {icon} <span>{label}</span>
                {count > 0 && <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md font-bold border bg-violet-50 text-violet-700 border-violet-200">{count}</span>}
              </button>
            ))}
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 flex items-center gap-1.5"><Clock size={12} />Buffer</span>
              <strong className="text-xs text-violet-600">30 min</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 flex items-center gap-1.5"><BarChart3 size={12} />Channels</span>
              <strong className="text-xs text-slate-600">WA + Web</strong>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 h-full overflow-hidden bg-slate-50 p-4 flex flex-col gap-4">

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 flex-shrink-0">
            {[
              { label: 'Total Intakes', value: conversations.length, icon: <MessageSquare size={18} className="text-violet-600" />, border: 'border-violet-200', num: 'text-violet-700' },
              { label: 'Confirmed Jobs', value: bookings.length, icon: <CalendarDays size={18} className="text-emerald-600" />, border: 'border-emerald-200', num: 'text-emerald-700' },
              { label: 'Travel Buffer', value: '30 min', icon: <Clock size={18} className="text-amber-600" />, border: 'border-amber-200', num: 'text-amber-700' },
              { label: 'Stripe Payouts', value: stripeStatus.onboardingComplete ? 'Active' : 'Not Setup', icon: <CreditCard size={18} className="text-sky-600" />, border: 'border-sky-200', num: 'text-sky-700' },
            ].map((card, i) => (
              <div key={i} className={`bg-white border ${card.border} rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow`}>
                <div>
                  <p className="text-xs text-slate-500 font-medium">{card.label}</p>
                  <h3 className={`text-2xl font-bold mt-0.5 ${card.num}`}>{card.value}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200">{card.icon}</div>
              </div>
            ))}
          </div>

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden min-h-0">
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-slate-100 space-y-2 flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <h2 className="text-sm font-bold text-slate-700">Intake Queue</h2>
                    <button onClick={refreshAll} className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1">
                      <RefreshCw size={12} /> Refresh
                    </button>
                  </div>
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search name or phone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                  </div>
                </div>
                <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
                  {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">No conversations found</div>
                  ) : filteredConversations.map(conv => {
                    const isSelected = selectedConversation?.id === conv.id;
                    const isWA = conv.channel === 'WHATSAPP';
                    return (
                      <div key={conv.id} onClick={() => setSelectedConversation(conv)}
                        className={`w-full text-left p-3.5 transition-all cursor-pointer ${isSelected ? 'bg-violet-50 border-l-2 border-violet-500' : 'hover:bg-slate-50 border-l-2 border-transparent'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-slate-800 text-xs">{conv.customer.name}</h4>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">{conv.customer.phone}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <select value={conv.status}
                              onChange={e => { e.stopPropagation(); handleUpdateConversationStatus(conv.id, e.target.value); }}
                              onClick={e => e.stopPropagation()}
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 focus:outline-none">
                              <option value="OPEN">OPEN</option>
                              <option value="BOOKED">BOOKED</option>
                              <option value="CLOSED">CLOSED</option>
                            </select>
                            <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleDeleteConversation(conv.id); }}
                              className="text-slate-400 hover:text-red-500 transition p-0.5">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 border ${isWA ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-violet-50 text-violet-600 border-violet-200'}`}>
                            <MessageSquare size={10} /> {isWA ? 'WhatsApp' : 'Web Chat'}
                          </span>
                          <span className="text-slate-400 text-[10px]">{conv.messages.length} msgs</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-7 h-full overflow-hidden">
                {selectedConversation ? (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">{selectedConversation.customer.name}</h3>
                        <p className="text-[11px] text-slate-400 font-mono">{selectedConversation.customer.phone} - {selectedConversation.channel}</p>
                      </div>
                      <span className="text-[10px] px-2.5 py-1 rounded-lg font-bold bg-slate-100 text-slate-600 border border-slate-200">{selectedConversation.status}</span>
                    </div>

                    {selectedConversation.bookings && selectedConversation.bookings.length > 0 && (
                      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 p-3 border-b border-violet-100 flex-shrink-0 space-y-2">
                        <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest px-1 flex items-center gap-1.5"><CalendarDays size={11} /> Bookings</p>
                        {selectedConversation.bookings.map(b => (
                          <div key={b.id} className="rounded-2xl bg-white border border-violet-200 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2 bg-violet-600 text-white">
                              <div className="flex items-center gap-2">
                                <CheckCircle size={13} />
                                <span className="text-xs font-bold">Booking Confirmed</span>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                b.status === 'CONFIRMED' ? 'bg-emerald-400/30 text-emerald-100' :
                                b.status === 'COMPLETED' ? 'bg-sky-400/30 text-sky-100' :
                                b.status === 'CANCELLED' ? 'bg-red-400/30 text-red-100' :
                                'bg-amber-400/30 text-amber-100'
                              }`}>{b.status}</span>
                            </div>
                            <div className="px-4 py-3 flex justify-between items-center gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-xs text-slate-700">
                                  <Clock size={11} className="text-violet-400" />
                                  <span className="font-semibold">{new Date(b.slotStart).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                  <CreditCard size={11} className="text-violet-400" />
                                  <span>Fee: <strong className="text-slate-800">${b.bookingFee}</strong></span>
                                </div>
                              </div>
                              <button onClick={() => handleGeneratePaymentLink(b.id)} disabled={generatingPayment === b.id}
                                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-xl transition disabled:opacity-50 flex items-center gap-1.5 shadow-sm shadow-violet-200 whitespace-nowrap">
                                <CreditCard size={12} /> {generatingPayment === b.id ? 'Generating...' : 'Send Stripe Link'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3 min-h-0">
                      {selectedConversation.messages.length === 0 && <div className="text-center text-slate-400 text-xs pt-8">No messages yet.</div>}

                      {selectedConversation.messages.map(msg => {
                        const isCustomer = msg.sender === 'CUSTOMER';
                        if (msg.sender === 'SYSTEM') return (
                          <div key={msg.id} className="flex justify-center">
                            <span className="text-[10px] text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-full">{msg.content}</span>
                          </div>
                        );
                        return (
                          <div key={msg.id} className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-sm px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                              isCustomer ? 'bg-white border border-slate-200 text-slate-700 rounded-bl-none' : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none'
                            }`}>
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                              {msg.sentAt && <span className="text-[9px] opacity-50 block text-right mt-1">{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 border-t border-slate-100 bg-white flex gap-2 flex-shrink-0">
                      <input type="text" placeholder="Type response..." value={replyContent} onChange={e => setReplyContent(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                        disabled={sendingMessage} />
                      <button onClick={handleSendMessage} disabled={sendingMessage || !replyContent.trim()}
                        className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold disabled:opacity-40 flex items-center gap-1.5 transition">
                        <Send size={13} /> Send
                      </button>
                    </div>

                    <div className="p-3 border-t border-slate-100 bg-white flex gap-2 flex-shrink-0">
                      <button onClick={() => { handleFetchSlots(); setShowSlotsModal(true); }}
                        className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-200 transition flex items-center justify-center gap-1.5">
                        <Search size={13} /> Check Slots
                      </button>
                      <button onClick={() => { setBookingError(''); setShowBookingModal(true); }}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5">
                        <Plus size={13} /> Create Booking
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center justify-center h-full space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center">
                      <MessageSquare size={20} className="text-violet-500" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-700">Select a Conversation</h3>
                    <p className="text-slate-400 text-xs max-w-xs">Click any conversation from the queue to reply or send payment links.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-5 min-h-0">
              <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 pb-4 flex-shrink-0">
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Job Bookings</h2>
                  <p className="text-xs text-slate-400 mt-0.5">30-min travel buffers applied</p>
                </div>
                <button onClick={() => setShowSlotsModal(true)}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5">
                  <Plus size={14} /> New Booking
                </button>
              </div>
              <div className="overflow-y-auto flex-1 mt-4">
                <table className="w-full text-left">
                  <thead className="text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 text-[10px] sticky top-0 bg-white">
                    <tr>
                      <th className="p-3">ID</th><th className="p-3">Customer</th><th className="p-3">Slot Time</th>
                      <th className="p-3">Fee</th><th className="p-3">Status</th><th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {bookings.length === 0 ? (
                      <tr><td colSpan={6} className="p-8 text-center text-slate-400 text-xs">No bookings found</td></tr>
                    ) : bookings.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono text-violet-600 font-bold text-xs">#{b.id.substring(0, 8)}</td>
                        <td className="p-3">
                          <strong className="text-slate-700 block text-xs">{b.customer?.name || 'Customer'}</strong>
                          <span className="text-[11px] text-slate-400 font-mono">{b.customer?.phone}</span>
                        </td>
                        <td className="p-3 text-slate-600 text-xs">{new Date(b.slotStart).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })} - {new Date(b.slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</td>
                        <td className="p-3 font-bold text-slate-800 text-xs">${b.bookingFee}</td>
                        <td className="p-3">
                          <select value={b.status} onChange={e => handleUpdateBookingStatus(b.id, e.target.value)}
                            className="bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold px-2 py-1 rounded-lg focus:outline-none">
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <button onClick={() => handleGeneratePaymentLink(b.id)} disabled={generatingPayment === b.id}
                            className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg font-semibold text-xs disabled:opacity-50 transition flex items-center gap-1.5">
                            <CreditCard size={12} /> {generatingPayment === b.id ? 'Generating...' : 'Send Link'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CUSTOMERS TAB */}
          {activeTab === 'customers' && (
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-5 min-h-0">
              <div className="border-b border-slate-100 pb-4 flex-shrink-0">
                <h2 className="text-sm font-bold text-slate-800">Customers Directory</h2>
                <p className="text-xs text-slate-400 mt-0.5">All intake records from WhatsApp and Web Chat</p>
              </div>
              <div className="overflow-y-auto flex-1 mt-4">
                <table className="w-full text-left">
                  <thead className="text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 text-[10px] sticky top-0 bg-white">
                    <tr>
                      <th className="p-3">Name</th><th className="p-3">Phone</th><th className="p-3">Channel</th>
                      <th className="p-3">Messages</th><th className="p-3">Bookings</th><th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {allCustomers.length === 0 ? (
                      <tr><td colSpan={6} className="p-8 text-center text-slate-400 text-xs">No customers yet</td></tr>
                    ) : allCustomers.map(cust => (
                      <tr key={cust.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-semibold text-slate-700 text-xs">{cust.name}</td>
                        <td className="p-3 font-mono text-slate-500 text-xs">{cust.phone}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border ${cust.channel === 'WHATSAPP' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-violet-50 text-violet-600 border-violet-200'}`}>
                            {cust.channel}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 text-xs">{cust.totalMessages} msgs</td>
                        <td className="p-3 text-emerald-600 font-semibold text-xs">{cust.bookingsCount} booked</td>
                        <td className="p-3">
                          <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit">
                            <CheckCircle size={10} /> Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* WORK AREAS TAB */}
          {activeTab === 'workareas' && (
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-5 min-h-0">
              <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 pb-4 flex-shrink-0">
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Work Area Zones</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Daily service coverage zones for slot availability</p>
                </div>
                <button onClick={() => setShowWorkAreaModal(true)}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5">
                  <Plus size={14} /> Add Zone
                </button>
              </div>
              <div className="overflow-y-auto flex-1 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {workAreas.length === 0 ? (
                    <div className="col-span-3 text-center py-10 text-slate-400 text-xs">No work areas configured yet.</div>
                  ) : workAreas.map(wa => (
                    <div key={wa.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 relative hover:border-violet-300 hover:shadow-md transition-all">
                      <button onClick={() => handleDeleteWorkArea(wa.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition">
                        <Trash2 size={13} />
                      </button>
                      <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
                        <MapPin size={18} className="text-violet-600" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm">{wa.area}</h3>
                      <p className="text-xs text-slate-400">{new Date(wa.availableDate).toLocaleDateString()}</p>
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <CheckCircle size={10} /> Active Zone
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CREATE BOOKING MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-800">
              Create Booking {selectedConversation ? 'for ' + selectedConversation.customer.name : ''}
            </h3>
            {bookingError && <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl">{bookingError}</div>}
            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Booking Date</label>
                <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className={inputCls} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Start Time</label>
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className={inputCls} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">End Time</label>
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className={inputCls} required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Booking Fee ($)</label>
                <input type="number" step="0.01" value={bookingFee} onChange={e => setBookingFee(e.target.value)} className={inputCls} required />
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <button type="button" onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={creatingBooking}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold disabled:opacity-50">
                  {creatingBooking ? 'Creating...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SLOTS MODAL */}
      {showSlotsModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Available Slots (30m Buffer)</h3>
            <div className="flex gap-2">
              <input type="date" value={slotsDate} onChange={e => setSlotsDate(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-violet-400" />
              <button onClick={handleFetchSlots} disabled={loadingSlots}
                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-xs font-bold">
                {loadingSlots ? 'Loading...' : 'Check'}
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {availableSlots.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No slots available or work area not set.</p>
              ) : availableSlots.map((slot, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-200 flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} className="text-slate-400" />
                    {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - {new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </span>
                  <button onClick={() => {
                    const s = new Date(slot.start), e = new Date(slot.end);
                    const pad = (n: number) => n.toString().padStart(2, '0');
                    setBookingDate(s.getFullYear() + '-' + pad(s.getMonth()+1) + '-' + pad(s.getDate()));
                    setStartTime(pad(s.getHours()) + ':' + pad(s.getMinutes()));
                    setEndTime(pad(e.getHours()) + ':' + pad(e.getMinutes()));
                    if (!selectedConversation && conversations.length > 0) setSelectedConversation(conversations[0]);
                    setShowSlotsModal(false); setShowBookingModal(true);
                  }} className="bg-violet-600 hover:bg-violet-700 text-white text-[11px] px-3 py-1.5 rounded-lg font-bold">
                    Select
                  </button>
                </div>
              ))}
            </div>
            <div className="text-right">
              <button onClick={() => setShowSlotsModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* WORK AREA MODAL */}
      {showWorkAreaModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Set Work Area Zone</h3>
            {workAreaMessage && <p className="text-xs font-semibold text-violet-600">{workAreaMessage}</p>}
            <form onSubmit={handleSetWorkArea} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Available Date</label>
                <input type="date" value={workAreaDate} onChange={e => setWorkAreaDate(e.target.value)} className={inputCls} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Area / Location Name</label>
                <input type="text" placeholder="e.g. North London, Camden" value={workAreaName} onChange={e => setWorkAreaName(e.target.value)} className={inputCls} required />
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <button type="button" onClick={() => setShowWorkAreaModal(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50">Close</button>
                <button type="submit" disabled={settingWorkArea}
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold disabled:opacity-50">
                  {settingWorkArea ? 'Saving...' : 'Save Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
