'use client';

import { useState } from 'react';
import WebChatWidget from '@/components/WebChatWidget';
import AuthModal from '@/components/AuthModal';
import Link from 'next/link';

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showChatOptions, setShowChatOptions] = useState(false);

  const trades = [
    {
      title: 'Electrical & Solar',
      traderName: 'Alex Morgan',
      role: 'Master Electrician',
      rating: '4.9 ★ (128 reviews)',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      tag: 'Available Today',
      area: 'North London',
    },
    {
      title: 'Plumbing & Heating',
      traderName: 'David Miller',
      role: 'Certified Heating Engineer',
      rating: '5.0 ★ (94 reviews)',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80',
      tag: 'Fast Response',
      area: 'Central London',
    },
    {
      title: 'Carpentry & Joinery',
      traderName: 'James Wilson',
      role: 'Custom Woodwork Expert',
      rating: '4.8 ★ (156 reviews)',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
      tag: 'Verified Pro',
      area: 'West London',
    },
    {
      title: 'Roofing & Building',
      traderName: 'Sam Hughes',
      role: 'Building Contractor',
      rating: '4.9 ★ (88 reviews)',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80',
      tag: 'Licensed',
      area: 'South London',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-200/50 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-200/50 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-sky-200/40 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Navigation */}
      <nav className="glass-panel sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/20">
              ⚡
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">Trade<span className="text-gradient">Slot</span></span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-indigo-600">Professional Trades Platform</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#traders" className="hover:text-indigo-600 transition-colors">Verified Tradespeople</a>
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 border border-slate-300 rounded-xl hover:border-indigo-400 transition-all bg-white shadow-sm"
            >
              Trader Portal
            </button>
            <button
              onClick={() => setShowChat(true)}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              💬 Book a Trader
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Multi-Channel WhatsApp & Web Chat Intake Active</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Book Trusted Local <br />
              <span className="text-gradient">Tradespeople</span> Instantly.
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              Connect directly with verified plumbers, electricians, carpenters, and contractors. Request time slots via WhatsApp or web chat with automated 30-minute travel buffer scheduling and secure Stripe Connect payments.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setShowChat(true)}
                className="px-6 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/25 transition-all transform hover:-translate-y-1 text-sm sm:text-base flex items-center space-x-2"
              >
                <span>🌐 Start Web Chat</span>
                <span>→</span>
              </button>

              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801700000000'}?text=Hello%20TradeSlot%2C%20I%20need%20a%20tradesperson%20booking%21`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/25 transition-all transform hover:-translate-y-1 text-sm sm:text-base flex items-center space-x-2"
              >
                <span>💬 Chat via WhatsApp</span>
                <span className="text-xs bg-emerald-700 px-2 py-0.5 rounded-full uppercase">Direct</span>
              </a>

              <button
                onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                className="px-6 py-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold rounded-2xl transition-all hover:border-indigo-400 text-sm sm:text-base flex items-center space-x-2 shadow-sm"
              >
                <span>🔑 Trader Portal</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-6">
              <div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900">30 Min</h4>
                <p className="text-xs text-slate-500 font-medium">Smart Travel Buffer</p>
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900">100%</h4>
                <p className="text-xs text-slate-500 font-medium">Stripe Protected</p>
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900">2 Channel</h4>
                <p className="text-xs text-slate-500 font-medium">WhatsApp & Web Chat</p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual — Tradesperson Card Stack */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl glow-primary">
              <div className="relative h-72 rounded-2xl overflow-hidden mb-6 group">
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
                  alt="Verified Tradesperson"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <span className="bg-emerald-500 text-white text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                      Verified Trader
                    </span>
                    <h3 className="text-xl font-extrabold text-white mt-1">Alex Morgan</h3>
                    <p className="text-xs text-slate-200">Master Electrician • London</p>
                  </div>
                  <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-amber-500 text-xs font-bold shadow">
                    ★ 4.9 (128)
                  </div>
                </div>
              </div>

              {/* Live Slot Card Preview */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">Today's Work Area: <strong className="text-slate-900">Camden / North London</strong></span>
                  <span className="text-emerald-600 font-bold">🟢 3 Slots Open</span>
                </div>
                <div className="flex gap-2">
                  <span className="flex-1 text-center py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-700">
                    10:00 - 11:00 AM
                  </span>
                  <span className="flex-1 text-center py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-700">
                    01:30 - 02:30 PM
                  </span>
                  <span className="flex-1 text-center py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-700">
                    04:00 - 05:00 PM
                  </span>
                </div>
                <button
                  onClick={() => setShowChat(true)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/20"
                >
                  Request One-Click Booking
                </button>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 z-20 bg-white p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center space-x-3 animate-float">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl">
                🛡️
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Flat Fee & Direct Payout</p>
                <p className="text-[11px] text-slate-500 font-medium">Powered by Stripe Connect</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Tradespeople Section */}
      <section id="traders" className="py-20 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Meet Verified <span className="text-gradient">Local Tradespeople</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Every tradesperson on TradeSlot is background-checked, insured, and equipped with automated slot scheduling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trades.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-3xl p-5 border border-slate-200 hover:border-indigo-400 transition-all duration-300 hover:-translate-y-1.5 group shadow-sm hover:shadow-xl"
              >
                <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={item.image}
                    alt={item.traderName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-indigo-700 shadow">
                    {item.title}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase shadow">
                    {item.tag}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                        {item.traderName}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{item.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-medium">📍 {item.area}</span>
                    <span className="text-amber-500 font-bold">{item.rating}</span>
                  </div>

                  <button
                    onClick={() => setShowChat(true)}
                    className="w-full mt-3 py-2.5 bg-white hover:bg-indigo-600 text-slate-800 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-200 hover:border-indigo-600 shadow-sm"
                  >
                    Check Available Slots
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              How <span className="text-gradient">TradeSlot Works</span>
            </h2>
            <p className="text-slate-600 text-sm">
              End-to-end multi-channel booking built for speed, transparency, and reliable travel scheduling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 text-2xl font-bold flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Send Message</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Reach out via WhatsApp or live web chat with your job requirements and location.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 text-2xl font-bold flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Get Available Slots</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                System automatically applies a 30-minute travel buffer between existing jobs and offers open time slots.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 border border-pink-200 text-pink-600 text-2xl font-bold flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Confirm Booking</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Select your preferred time slot. Trader confirms and issues your instant job booking.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-2xl font-bold flex items-center justify-center mx-auto">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Stripe Direct Pay</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Pay securely online. Trader receives payout directly via Stripe Connect with flat platform fee capture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 mx-4 sm:mx-8 my-10 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden text-center glow-purple">
        <div className="max-w-4xl mx-auto px-6 space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Book Your Local Tradesperson?
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Experience fast, reliable booking without phone tag or double bookings.
          </p>
          <button
            onClick={() => setShowChat(true)}
            className="px-8 py-4 bg-white text-indigo-900 font-extrabold rounded-2xl hover:bg-slate-100 transition shadow-2xl text-base"
          >
            Start Booking Chat Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10 bg-white text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-4">
          <p>© 2026 TradeSlot Platform. All rights reserved.</p>
          <div className="flex space-x-6 font-medium">
            <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} className="hover:text-indigo-600">
              Trader Portal
            </button>
            <a href="#how-it-works" className="hover:text-indigo-600">How It Works</a>
          </div>
        </div>
      </footer>

      {/* Web Chat Widget */}
      {showChat && <WebChatWidget onClose={() => setShowChat(false)} />}

      {/* Auth Modal (Login / Register Tabs in Popup) */}
      {showAuthModal && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Backdrop to close options on outside click */}
      {showChatOptions && (
        <div className="fixed inset-0 z-30" onClick={() => setShowChatOptions(false)} />
      )}

      {/* Floating Chat Launcher */}
      {!showChat && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">

          {/* Options popup */}
          {showChatOptions && (
            <div className="flex flex-col gap-2 mb-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801700000000'}?text=Hello%20TradeSlot%2C%20I%20need%20a%20tradesperson%20booking%21`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowChatOptions(false)}
                className="flex items-center gap-3 bg-white border border-slate-200 shadow-xl rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 hover:border-emerald-400 hover:shadow-emerald-100 transition-all group"
              >
                <span className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white text-base shadow-md group-hover:scale-110 transition-transform">💬</span>
                <div>
                  <p className="font-bold text-slate-800">Chat via WhatsApp</p>
                  <p className="text-[10px] text-slate-400 font-medium">Opens WhatsApp directly</p>
                </div>
              </a>
              <button
                onClick={() => { setShowChatOptions(false); setShowChat(true); }}
                className="flex items-center gap-3 bg-white border border-slate-200 shadow-xl rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 hover:border-indigo-400 hover:shadow-indigo-100 transition-all group"
              >
                <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-base shadow-md group-hover:scale-110 transition-transform">🌐</span>
                <div className="text-left">
                  <p className="font-bold text-slate-800">Live Web Chat</p>
                  <p className="text-[10px] text-slate-400 font-medium">Chat right here on site</p>
                </div>
              </button>
            </div>
          )}

          {/* Avatar button */}
          <button
            onClick={() => setShowChatOptions(prev => !prev)}
            className="relative w-14 h-14 rounded-full shadow-2xl shadow-indigo-500/40 hover:scale-110 transition-transform flex items-center justify-center border-2 border-white bg-slate-900 overflow-visible cursor-pointer"
          >
            <img
              src="/images.png"
              alt="TradeSlot Chat Avatar"
              className="w-full h-full rounded-full object-cover"
            />
            {/* Blinking green dot */}
            <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 z-10">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
