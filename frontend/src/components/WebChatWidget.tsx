'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: 'CUSTOMER' | 'TRADER' | 'SYSTEM';
  content: string;
  sentAt?: string;
}

export default function WebChatWidget({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'form' | 'chat'>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Poll for new messages every 4 seconds (trader replies)
  useEffect(() => {
    if (step !== 'chat' || !phone) return;
    const poll = async () => {
      try {
        const res = await fetch(`${API}/channels/webchat/messages?phone=${encodeURIComponent(phone)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setMessages(data.data);
        }
      } catch {}
    };
    poll();
    const interval = setInterval(poll, 4000);
    return () => clearInterval(interval);
  }, [step, phone]);

  const handleStart = () => {
    if (!name.trim() || !phone.trim()) {
      setError('Please enter your name and phone number.');
      return;
    }
    setError('');
    setStep('chat');
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setLoading(true);
    setError('');

    // Optimistically add message to UI
    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      sender: 'CUSTOMER',
      content: text,
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch(`${API}/channels/webchat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, text, name }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || 'Failed to send message.');
        setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
        setInput(text);
        return;
      }

      // Fetch latest messages from server to sync
      const msgRes = await fetch(`${API}/channels/webchat/messages?phone=${encodeURIComponent(phone)}`);
      const msgData = await msgRes.json();
      if (msgData.success && Array.isArray(msgData.data)) {
        setMessages(msgData.data);
      }
    } catch {
      setError('Cannot connect to server.');
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      setInput(text);
    } finally {
      setLoading(false);
    }
  };

  const extractUrl = (text: string) => text.match(/(https?:\/\/[^\s]+)/)?.[0] || null;
  const isBookingMsg = (text: string) => text.toLowerCase().startsWith('booking confirmed:');
  const parseBooking = (text: string) => {
    const slotMatch = text.match(/Booking Confirmed:\s*(.+?)\s*\(Fee:\s*\$([\d.]+)\)/);
    return slotMatch ? { slot: slotMatch[1], fee: slotMatch[2] } : null;
  };

  return (
    <div
      className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden text-slate-100 font-sans"
      style={{ height: '600px' }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/80 via-slate-900 to-purple-900/80 p-4 border-b border-slate-800 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
              ⚡
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">TradeSlot Direct Chat</h3>
            <p className="text-[11px] text-emerald-400 font-semibold">🟢 Online • Web Chat</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl w-8 h-8 flex items-center justify-center transition"
        >
          ✕
        </button>
      </div>

      {/* WhatsApp Banner */}
      <div className="bg-emerald-950/80 border-b border-emerald-800/60 px-4 py-2 flex items-center justify-between text-xs text-emerald-300 flex-shrink-0">
        <span className="flex items-center gap-1.5 font-medium">💬 Prefer WhatsApp?</span>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801700000000'}?text=Hello%20TradeSlot%2C%20I%20need%20a%20booking!`}
          target="_blank"
          rel="noreferrer"
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg font-bold text-[11px] transition"
        >
          Open WhatsApp ↗
        </a>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/70">
        {step === 'chat' && messages.length === 0 && (
          <div className="text-center text-slate-500 text-xs pt-6">
            Send a message to start the conversation.
          </div>
        )}

        {messages.map((msg) => {
          const isCustomer = msg.sender === 'CUSTOMER';
          const url = extractUrl(msg.content);
          const isPayment = msg.content.toLowerCase().includes('payment link') || !!url;

          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isCustomer ? 'justify-end' : 'justify-start'}`}>
              {!isCustomer && (
                <img
                  src="/images.png"
                  alt="Trader Avatar"
                  className="w-6 h-6 rounded-full object-cover border border-slate-700 shadow-xs flex-shrink-0 mb-0.5"
                />
              )}
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-lg break-words text-xs leading-relaxed ${
                  isCustomer
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                    : isPayment
                    ? 'bg-slate-900 border border-purple-500/40 text-slate-100 rounded-bl-none'
                    : isBookingMsg(msg.content)
                    ? 'bg-slate-900 border border-emerald-500/40 text-slate-100 rounded-bl-none p-0 overflow-hidden'
                    : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-none'
                }`}
              >
                {isBookingMsg(msg.content) ? (
                  <div className="space-y-0">
                    <div className="bg-emerald-600/20 border-b border-emerald-500/30 px-4 py-2 flex items-center gap-2">
                      <span className="text-emerald-400 text-base">✅</span>
                      <p className="text-emerald-400 font-bold text-xs">Booking Confirmed!</p>
                    </div>
                    <div className="px-4 py-3 space-y-1.5">
                      {(() => {
                        const b = parseBooking(msg.content);
                        return b ? (
                          <>
                            <div className="flex items-center gap-2 text-slate-300">
                              <span className="text-slate-500">🗓</span>
                              <span className="font-semibold">{b.slot}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <span className="text-slate-500">💰</span>
                              <span>Booking Fee: <strong className="text-white">${b.fee}</strong></span>
                            </div>
                          </>
                        ) : <p className="text-slate-300">{msg.content}</p>;
                      })()}
                    </div>
                  </div>
                ) : isPayment && url ? (
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-purple-300">💳 Payment Link</p>
                    <p>{msg.content.replace(url, '').trim()}</p>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full text-center py-2 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition"
                    >
                      💳 Complete Payment on Stripe
                    </a>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
                {msg.sentAt && (
                  <span className="text-[9px] opacity-50 block text-right mt-1">
                    {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-end">
            <div className="bg-indigo-600/40 px-4 py-2.5 rounded-2xl rounded-br-none flex space-x-1.5">
              <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
              <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <p className="text-[10px] text-red-400 bg-red-950/50 border border-red-800 px-3 py-1.5 rounded-xl">{error}</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Customer Info Form */}
      {step === 'form' && (
        <div className="border-t border-slate-800 p-5 space-y-3 bg-slate-900/90 flex-shrink-0">
          <p className="text-xs text-slate-300 font-bold">Enter your details to start:</p>
          {error && <p className="text-[10px] text-red-400">{error}</p>}
          <input
            type="text"
            placeholder="Your Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
          <input
            type="tel"
            placeholder="Your Phone Number (e.g. 07123456789)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-lg"
          >
            Start Chat
          </button>
        </div>
      )}

      {/* Message Input */}
      {step === 'chat' && (
        <div className="border-t border-slate-800 p-3 flex gap-2 bg-slate-900/90 flex-shrink-0">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl disabled:opacity-50 transition font-bold text-xs"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
