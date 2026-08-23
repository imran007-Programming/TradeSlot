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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden text-[#0F172A] font-sans"
      style={{ height: '600px' }}
    >
      {/* Header */}
      <div className="bg-[#0F172A] p-4 flex justify-between items-center flex-shrink-0 text-white">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src="/images.png"
              alt="TradeSlot Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-[#84EA00] shadow-sm"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#84EA00] border-2 border-[#0F172A] rounded-full" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">TradeSlot Direct Chat</h3>
            <p className="text-[11px] text-[#84EA00] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#84EA00]" /> Online • Web Chat
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl w-8 h-8 flex items-center justify-center transition cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {step === 'chat' && messages.length === 0 && (
          <div className="text-center text-slate-400 text-xs pt-6">
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
                  className="w-6 h-6 rounded-full object-cover border border-slate-200 shadow-xs flex-shrink-0 mb-0.5"
                />
              )}
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-xs break-words text-xs leading-relaxed ${
                  isCustomer
                    ? 'bg-[#0F172A] text-white rounded-br-none'
                    : isPayment
                    ? 'bg-white border-2 border-[#84EA00] text-[#0F172A] rounded-bl-none'
                    : isBookingMsg(msg.content)
                    ? 'bg-white border-2 border-[#84EA00] text-[#0F172A] rounded-bl-none p-0 overflow-hidden'
                    : 'bg-white border border-slate-200 text-[#0F172A] rounded-bl-none'
                }`}
              >
                {isBookingMsg(msg.content) ? (
                  <div className="space-y-0">
                    <div className="bg-[#F4FEE5] border-b border-[#84EA00]/30 px-4 py-2 flex items-center gap-2">
                      <span className="text-[#0F172A] text-base">✅</span>
                      <p className="text-[#0F172A] font-black text-xs">Booking Confirmed!</p>
                    </div>
                    <div className="px-4 py-3 space-y-1.5">
                      {(() => {
                        const b = parseBooking(msg.content);
                        return b ? (
                          <>
                            <div className="flex items-center gap-2 text-slate-700">
                              <span className="text-slate-400">🗓</span>
                              <span className="font-bold">{b.slot}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700">
                              <span className="text-slate-400">💰</span>
                              <span>Booking Fee: <strong className="text-[#0F172A]">${b.fee}</strong></span>
                            </div>
                          </>
                        ) : <p className="text-slate-700">{msg.content}</p>;
                      })()}
                    </div>
                  </div>
                ) : isPayment && url ? (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-[#0F172A]">💳 Payment Link</p>
                    <p className="text-slate-700">{msg.content.replace(url, '').trim()}</p>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full text-center py-2.5 px-3 bg-[#84EA00] hover:bg-[#74D100] text-[#0F172A] text-xs font-black rounded-xl transition shadow-sm"
                    >
                      💳 Complete Payment on Stripe
                    </a>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
                {msg.sentAt && (
                  <span className={`text-[9px] block text-right mt-1 ${isCustomer ? 'text-slate-400' : 'text-slate-400'}`}>
                    {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-end">
            <div className="bg-[#F4FEE5] border border-[#84EA00] px-4 py-2.5 rounded-2xl rounded-br-none flex space-x-1.5">
              <div className="w-1.5 h-1.5 bg-[#0F172A] rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-[#0F172A] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
              <div className="w-1.5 h-1.5 bg-[#0F172A] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <p className="text-[10px] text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl font-medium">{error}</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Customer Info Form */}
      {step === 'form' && (
        <div className="border-t border-slate-200 p-5 space-y-3 bg-white flex-shrink-0">
          <p className="text-xs text-[#0F172A] font-bold">Enter your details to start:</p>
          {error && <p className="text-[10px] text-red-600">{error}</p>}
          <input
            type="text"
            placeholder="Your Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#84EA00]/30 transition"
          />
          <input
            type="tel"
            placeholder="Your Phone Number (e.g. 07123456789)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#84EA00]/30 transition"
          />
          <button
            onClick={handleStart}
            className="w-full bg-[#84EA00] hover:bg-[#74D100] text-[#0F172A] py-2.5 rounded-xl text-xs font-black transition shadow-sm cursor-pointer border border-[#84EA00]"
          >
            Start Chat
          </button>
        </div>
      )}

      {/* Message Input */}
      {step === 'chat' && (
        <div className="border-t border-slate-200 p-3 flex gap-2 bg-white flex-shrink-0">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#84EA00]/30 transition"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-[#84EA00] hover:bg-[#74D100] text-[#0F172A] px-4 py-2.5 rounded-xl disabled:opacity-50 transition font-black text-xs cursor-pointer shadow-sm border border-[#84EA00]"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
