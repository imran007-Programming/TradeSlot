'use client';

import { useState } from 'react';
import WebChatWidget from '@/components/WebChatWidget';
import AuthModal from '@/components/AuthModal';
import {
  Zap, ShieldCheck, Clock, CalendarDays, MessageSquare, CreditCard,
  CheckCircle2, Star, MapPin, ChevronRight, Phone, ArrowRight,
  Sparkles, Wrench, Award, Search, Users, Check, HelpCircle
} from 'lucide-react';

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const categories = [
    { id: 'All', label: 'All Services', icon: '⚡' },
    { id: 'Electrician', label: 'Electrical & EV', icon: '💡' },
    { id: 'Plumber', label: 'Plumbing & Gas', icon: '🔧' },
    { id: 'HVAC', label: 'Heating & AC', icon: '❄️' },
    { id: 'Carpentry', label: 'Carpentry & Wood', icon: '🪚' },
    { id: 'Roofing', label: 'Roofing & Gutter', icon: '🏠' },
    { id: 'Painting', label: 'Painting & Decor', icon: '🎨' },
  ];

  const trades = [
    {
      category: 'Electrician',
      title: 'Electrical & EV Charger Installation',
      traderName: 'Alex Morgan',
      role: 'Master Electrician • 12+ Yrs Exp',
      rating: '4.9',
      reviewCount: 142,
      hourlyRate: '$55',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      tag: 'Available Today',
      area: 'North & Central London',
      features: ['NICEIC Certified', 'EV Ready', 'Emergency Callout'],
    },
    {
      category: 'Plumber',
      title: 'Emergency Plumbing & Boiler Servicing',
      traderName: 'David Miller',
      role: 'Gas Safe Heating Specialist',
      rating: '5.0',
      reviewCount: 98,
      hourlyRate: '$60',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80',
      tag: 'Fast 30m Response',
      area: 'West & South London',
      features: ['Gas Safe Registered', 'Leak Detection', 'Boiler Installs'],
    },
    {
      category: 'Carpentry',
      title: 'Custom Joinery & Architectural Woodwork',
      traderName: 'James Wilson',
      role: 'Master Carpenter & Joiner',
      rating: '4.8',
      reviewCount: 164,
      hourlyRate: '$50',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
      tag: 'Top Rated Pro',
      area: 'Camden & Islington',
      features: ['Bespoke Cabinets', 'Flooring', 'Door Fitting'],
    },
    {
      category: 'HVAC',
      title: 'Air Conditioning & Heat Pump Systems',
      traderName: 'Marcus Vance',
      role: 'HVAC Certified Engineer',
      rating: '4.9',
      reviewCount: 86,
      hourlyRate: '$65',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80',
      tag: 'Energy Certified',
      area: 'Greater London',
      features: ['F-Gas Certified', 'Eco Heat Pumps', 'Annual Servicing'],
    },
    {
      category: 'Roofing',
      title: 'Roof Repairs, Flat Roofs & Gutters',
      traderName: 'Sam Hughes',
      role: 'Roofing Contractor',
      rating: '4.9',
      reviewCount: 110,
      hourlyRate: '$55',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80',
      tag: 'Guaranteed Work',
      area: 'South & East London',
      features: ['Tile & Slate', 'Gutter Cleaning', '10-Yr Guarantee'],
    },
    {
      category: 'Painting',
      title: 'Interior & Exterior Precision Painting',
      traderName: 'Elena Rostova',
      role: 'Decorative Finish Expert',
      rating: '5.0',
      reviewCount: 79,
      hourlyRate: '$45',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
      tag: 'Clean & Fast',
      area: 'Kensington & Chelsea',
      features: ['Dustless Sanding', 'Eco Paints', 'Commercial & Domestic'],
    },
  ];

  const filteredTrades = trades.filter((t) => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.traderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const faqs = [
    {
      q: 'How does the automated 30-minute travel buffer work?',
      a: 'TradeSlot automatically calculates travel times between service locations and inserts a mandatory 30-minute buffer after every booking. This guarantees your tradesperson arrives on time without running late from prior appointments.',
    },
    {
      q: 'Can I book directly through WhatsApp?',
      a: 'Yes! You can tap "WhatsApp Booking" to instantly message our scheduling bot or verified tradesperson. Your slots and booking confirmations are synchronized across both WhatsApp and web in real-time.',
    },
    {
      q: 'How are payments protected?',
      a: 'All transactions are processed through Stripe Connect. Your booking fee and job payment are held securely and only transferred upon confirmed appointment scheduling.',
    },
    {
      q: 'How do tradespeople join TradeSlot?',
      a: 'Tradespeople can click "Trader Portal" to create an account, verify their credentials, set daily service zones, and connect their Stripe account for instant direct payouts.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-[#0F172A] selection:bg-[#84EA00] selection:text-[#0F172A] font-sans antialiased">
      
      {/* 1. TOP NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F172A] flex items-center justify-center text-[#84EA00] shadow-md shadow-slate-300">
              <Zap size={20} className="fill-[#84EA00] text-[#84EA00]" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A]">
                Trade<span className="text-[#84EA00] font-black">Slot</span>
              </span>
              <span className="hidden sm:block text-[9px] uppercase font-black tracking-widest text-slate-500">
                • Verified On-Demand Services
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#services" className="hover:text-[#0F172A] transition-colors">Services</a>
            <a href="#how-it-works" className="hover:text-[#0F172A] transition-colors">How It Works</a>
            <a href="#schedule-guarantee" className="hover:text-[#0F172A] transition-colors">30m Buffer</a>
            <a href="#traders" className="hover:text-[#0F172A] transition-colors">Verified Pros</a>
            <a href="#faq" className="hover:text-[#0F172A] transition-colors">FAQ</a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-[#0F172A] hover:bg-slate-100 rounded-xl border border-slate-200 transition cursor-pointer"
            >
              Trader Portal
            </button>
            <button
              onClick={() => setShowChat(true)}
              className="px-4 sm:px-5 py-2.5 bg-[#84EA00] hover:bg-[#74D100] text-[#0F172A] rounded-xl text-xs sm:text-sm font-black shadow-md shadow-[#84EA00]/25 transition-all hover:scale-102 active:scale-98 flex items-center gap-2 cursor-pointer border border-[#84EA00]"
            >
              <MessageSquare size={15} />
              <span>Book a Service</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-slate-50 border-b border-slate-200">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#F4FEE5]/70 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Live Status Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4FEE5] border border-[#84EA00] text-[#0F172A] text-xs font-black shadow-xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#84EA00] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#84EA00]" />
                </span>
                <span>Instant Scheduling Active in London & UK Zones</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.12]">
                Book Trusted Local <br />
                <span className="bg-[#0F172A] text-[#84EA00] px-2 py-0.5 rounded-xl inline-block mt-1">Trades & Pros</span> in Minutes.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                Connect directly with certified electricians, plumbers, carpenters, and heating specialists. Instant scheduling via WhatsApp or Web Chat with smart 30-minute travel buffers and Stripe protection.
              </p>

              {/* Action Bar / Search Input */}
              <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xl max-w-xl mx-auto lg:mx-0 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
                <div className="relative flex-1 flex items-center px-3">
                  <Search size={16} className="text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search trade (e.g. Electrician, Boiler, Camden)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-2.5 pr-2 py-2 text-xs sm:text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none bg-transparent font-medium"
                  />
                </div>
                <button
                  onClick={() => setShowChat(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-[#0F172A] hover:bg-[#1E293B] text-[#84EA00] text-xs sm:text-sm font-black rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Check Slots</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Multi-Channel Quick Action CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801700000000'}?text=Hello%20TradeSlot%2C%20I%20need%20a%20tradesperson%20booking%21`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-[#84EA00] hover:bg-[#74D100] text-[#0F172A] rounded-xl font-black text-xs sm:text-sm shadow-md shadow-[#84EA00]/25 transition flex items-center gap-2 cursor-pointer border border-[#84EA00]"
                >
                  <span>💬 WhatsApp Booking</span>
                  <span className="text-[10px] bg-[#0F172A] text-white px-2 py-0.5 rounded-md uppercase tracking-wider">Direct</span>
                </a>
                <button
                  onClick={() => setShowChat(true)}
                  className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>🌐 Open Web Chat</span>
                </button>
              </div>

              {/* Trust Metrics Pill Row */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-[#0F172A]">30 Min</h4>
                  <p className="text-[11px] text-slate-500 font-bold">Travel Buffer Routing</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-[#0F172A]">4.9 ★</h4>
                  <p className="text-[11px] text-slate-500 font-bold">Verified Ratings</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-[#0F172A]">100%</h4>
                  <p className="text-[11px] text-slate-500 font-bold">Stripe Escrow Safe</p>
                </div>
              </div>

            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-5 relative z-10">
                
                {/* Trader Profile Snapshot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80"
                      alt="Featured Trader"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-black text-[#0F172A] text-sm">Alex Morgan</h3>
                        <ShieldCheck size={16} className="text-[#0F172A]" />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Master Electrician • 12+ Yrs</p>
                      <div className="flex items-center gap-1 text-[11px] text-[#0F172A] font-black mt-0.5">
                        <span>★ 4.9</span>
                        <span className="text-slate-400 font-normal">(142 verified jobs)</span>
                      </div>
                    </div>
                  </div>
                  <span className="bg-[#F4FEE5] text-[#0F172A] border border-[#84EA00] text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                    Available
                  </span>
                </div>

                {/* Simulated Real-Time Slot Picker */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <CalendarDays size={13} className="text-[#0F172A]" />
                      Today&apos;s Coverage Zone:
                    </span>
                    <strong className="text-[#0F172A] font-black">Camden & Islington</strong>
                  </div>

                  {/* Slot pills */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-black">
                    <div className="p-2.5 rounded-xl border border-slate-200 bg-white text-[#0F172A] shadow-2xs">
                      09:00 - 10:00 AM
                    </div>
                    <div className="p-2.5 rounded-xl border-2 border-[#0F172A] bg-[#84EA00] text-[#0F172A] shadow-xs">
                      11:00 - 12:00 PM
                    </div>
                    <div className="p-2.5 rounded-xl border border-slate-200 bg-white text-[#0F172A] shadow-2xs">
                      02:00 - 03:00 PM
                    </div>
                  </div>

                  {/* Travel buffer indicator */}
                  <div className="flex items-center justify-between text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <Clock size={12} className="text-[#0F172A]" />
                      Automatic 30m Buffer:
                    </span>
                    <span className="font-black text-[#0F172A] bg-[#F4FEE5] px-2 py-0.5 rounded border border-[#84EA00]">
                      ✅ Applied
                    </span>
                  </div>
                </div>

                {/* Instant Book CTA */}
                <button
                  onClick={() => setShowChat(true)}
                  className="w-full py-3.5 bg-[#84EA00] hover:bg-[#74D100] text-[#0F172A] text-xs sm:text-sm font-black rounded-2xl shadow-lg shadow-[#84EA00]/25 transition flex items-center justify-center gap-2 cursor-pointer border border-[#84EA00]"
                >
                  <MessageSquare size={16} />
                  <span>Request Instant Booking</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium pt-1">
                  <CreditCard size={12} className="text-slate-500" />
                  <span>Stripe Protected • Flat fee booking guarantee</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SERVICE CATEGORY SELECTOR */}
      <section id="services" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              Popular Home Services &amp; Trade Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Select a service to view background-checked professionals with open schedule slots.
            </p>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none justify-start sm:justify-center">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#0F172A] text-[#84EA00] shadow-md shadow-slate-300 scale-102 border border-[#0F172A]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Trade Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredTrades.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-[#0F172A] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group space-y-4"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-[#0F172A] text-white px-2.5 py-1 rounded-xl text-[11px] font-black shadow-xs">
                      {item.category}
                    </span>
                    <span className="absolute bottom-3 right-3 bg-[#84EA00] text-[#0F172A] text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs border border-[#84EA00]">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Trader Info */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start">
                      <h3 className="font-black text-sm text-[#0F172A] group-hover:text-black transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{item.traderName} • <span className="text-slate-500 font-normal">{item.role}</span></p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin size={12} className="text-slate-400" />
                      {item.area}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {item.features.map((f, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Rates from</span>
                    <p className="text-base font-black text-[#0F172A]">{item.hourlyRate}<span className="text-xs font-normal text-slate-500">/hr</span></p>
                  </div>
                  <button
                    onClick={() => setShowChat(true)}
                    className="px-4 py-2 bg-[#84EA00] hover:bg-[#74D100] text-[#0F172A] text-xs font-black rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1 border border-[#84EA00]"
                  >
                    <span>Book Slot</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-black tracking-widest text-[#0F172A] bg-[#F4FEE5] px-3 py-1 rounded-full border border-[#84EA00]">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A]">
              How TradeSlot Intelligent Booking Works
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Zero phone tag. Real-time slot allocation with verified travel buffers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3 shadow-xs relative">
              <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-[#84EA00] font-black text-xl flex items-center justify-center">
                1
              </div>
              <h3 className="font-black text-[#0F172A] text-base">Send Inquiry</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Connect via WhatsApp or Web Chat. Share your job details and location.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3 shadow-xs relative">
              <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-[#84EA00] font-black text-xl flex items-center justify-center">
                2
              </div>
              <h3 className="font-black text-[#0F172A] text-base">30m Buffer Routing</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Our engine checks the trader&apos;s daily zone and adds travel buffers to avoid delays.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3 shadow-xs relative">
              <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-[#84EA00] font-black text-xl flex items-center justify-center">
                3
              </div>
              <h3 className="font-black text-[#0F172A] text-base">Pick Schedule</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Choose an available slot directly in our interactive schedule selector.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3 shadow-xs relative">
              <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-[#84EA00] font-black text-xl flex items-center justify-center">
                4
              </div>
              <h3 className="font-black text-[#0F172A] text-base">Secure Stripe Pay</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Pay securely online with Stripe escrow. The trader is notified and booked instantly.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. 30-MINUTE BUFFER GUARANTEE */}
      <section id="schedule-guarantee" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0F172A] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs uppercase font-black tracking-widest text-[#84EA00] bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                  Smart Travel Architecture
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  Why the 30-Minute Travel Buffer Changes Everything
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl font-medium">
                  Traditional booking sites allow back-to-back scheduling, resulting in late arrivals, traffic stress, and cancelled jobs. TradeSlot calculates realistic travel buffers between job locations so trades arrive on time, every time.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
                    <p className="text-[#84EA00] font-black text-lg">0%</p>
                    <p className="text-xs text-slate-300 font-bold">Overlapping Bookings</p>
                  </div>
                  <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
                    <p className="text-[#84EA00] font-black text-lg">99.4%</p>
                    <p className="text-xs text-slate-300 font-bold">On-Time Arrival Rate</p>
                  </div>
                  <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
                    <p className="text-[#84EA00] font-black text-lg">Direct</p>
                    <p className="text-xs text-slate-300 font-bold">Stripe Escrow Security</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-3">
                <button
                  onClick={() => setShowChat(true)}
                  className="w-full py-4 bg-[#84EA00] hover:bg-[#74D100] text-[#0F172A] font-black rounded-2xl shadow-xl transition text-center cursor-pointer text-sm border border-[#84EA00]"
                >
                  Book with Guaranteed Buffer
                </button>
                <button
                  onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
                  className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl border border-slate-700 transition text-center cursor-pointer text-xs"
                >
                  Join as a Registered Trader →
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section id="faq" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Everything you need to know about TradeSlot bookings and payments.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-[#0F172A] flex justify-between items-center gap-4 cursor-pointer hover:bg-slate-50"
                  >
                    <span>{faq.q}</span>
                    <span className="text-[#0F172A] font-black text-base">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 font-medium">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-white py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#0F172A] flex items-center justify-center text-[#84EA00] text-xs font-bold">
              ⚡
            </div>
            <p className="font-black text-[#0F172A]">TradeSlot Platform</p>
            <span className="text-slate-400">© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 font-bold">
            <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} className="hover:text-[#0F172A] cursor-pointer">
              Trader Portal
            </button>
            <a href="#services" className="hover:text-[#0F172A]">Services</a>
            <a href="#how-it-works" className="hover:text-[#0F172A]">How It Works</a>
            <button onClick={() => setShowChat(true)} className="hover:text-[#0F172A] cursor-pointer">
              Live Web Chat
            </button>
          </div>
        </div>
      </footer>

      {/* Web Chat Widget Modal */}
      {showChat && <WebChatWidget onClose={() => setShowChat(false)} />}

      {/* Auth Modal (Login / Register Tabs) */}
      {showAuthModal && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Backdrop to close floating options */}
      {showChatOptions && (
        <div className="fixed inset-0 z-30" onClick={() => setShowChatOptions(false)} />
      )}

      {/* Floating Action Chat Launcher with Avatar */}
      {!showChat && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
          
          {/* Options Popup */}
          {showChatOptions && (
            <div className="flex flex-col gap-2 mb-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801700000000'}?text=Hello%20TradeSlot%2C%20I%20need%20a%20tradesperson%20booking%21`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowChatOptions(false)}
                className="flex items-center gap-3 bg-white border border-slate-200 shadow-xl rounded-2xl px-4 py-3 text-xs font-bold text-[#0F172A] hover:border-[#84EA00] hover:shadow-[#84EA00]/20 transition-all group cursor-pointer"
              >
                <span className="w-8 h-8 rounded-xl bg-[#84EA00] flex items-center justify-center text-[#0F172A] text-base shadow-md group-hover:scale-110 transition-transform">
                  💬
                </span>
                <div>
                  <p className="font-bold text-[#0F172A]">Chat via WhatsApp</p>
                  <p className="text-[10px] text-slate-400 font-medium">Opens WhatsApp directly</p>
                </div>
              </a>
              <button
                onClick={() => { setShowChatOptions(false); setShowChat(true); }}
                className="flex items-center gap-3 bg-white border border-slate-200 shadow-xl rounded-2xl px-4 py-3 text-xs font-bold text-[#0F172A] hover:border-[#0F172A] hover:shadow-slate-200 transition-all group cursor-pointer"
              >
                <span className="w-8 h-8 rounded-xl bg-[#0F172A] text-[#84EA00] flex items-center justify-center text-base shadow-md group-hover:scale-110 transition-transform">
                  🌐
                </span>
                <div className="text-left">
                  <p className="font-bold text-[#0F172A]">Live Web Chat</p>
                  <p className="text-[10px] text-slate-400 font-medium">Chat right here on site</p>
                </div>
              </button>
            </div>
          )}

          {/* Floating Round Launcher Button */}
          <button
            onClick={() => setShowChatOptions((prev) => !prev)}
            className="relative w-14 h-14 rounded-full shadow-2xl shadow-slate-900/40 hover:scale-108 active:scale-95 transition-transform flex items-center justify-center border-2 border-white bg-slate-900 overflow-visible cursor-pointer"
          >
            <img
              src="/images.png"
              alt="TradeSlot Chat Avatar"
              className="w-full h-full rounded-full object-cover"
            />
            {/* Pulsing Green Active Dot in Electric Lime */}
            <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 z-10">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#84EA00] opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#84EA00] border-2 border-[#0F172A]" />
            </span>
          </button>
        </div>
      )}

    </div>
  );
}
