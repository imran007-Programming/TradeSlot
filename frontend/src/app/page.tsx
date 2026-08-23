'use client';

import { useState } from 'react';
import {
  Navbar,
  HeroCarousel,
  ServicesSection,
  CustomerCareSection,
  HowItWorksSection,
  BufferGuaranteeSection,
  FaqSection,
  Footer,
  WebChatWidget,
  ChatFloatingButton,
  AuthModal,
} from '@/components/Home';

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleOpenChat = () => {
    setShowChat(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#0F172A] selection:bg-[#E11D48] selection:text-white font-sans antialiased">
      {/* 1. Top Navbar */}
      <Navbar onOpenAuth={handleOpenAuth} onOpenChat={handleOpenChat} />

      {/* 2. Full-Width Hero Banner Carousel (Images Only) */}
      <HeroCarousel />

      {/* 3. Popular Services & Categories Grid */}
      <ServicesSection onOpenChat={handleOpenChat} />

      {/* 4. Dedicated 24/7 Customer Care Section */}
      <CustomerCareSection onOpenChat={handleOpenChat} />

      {/* 5. How It Works (4-Step Process) */}
      <HowItWorksSection />

      {/* 6. Smart 30-Minute Travel Buffer Guarantee */}
      <BufferGuaranteeSection onOpenChat={handleOpenChat} onOpenAuth={handleOpenAuth} />

      {/* 7. FAQ Section */}
      <FaqSection />

      {/* 8. Footer */}
      <Footer onOpenAuth={handleOpenAuth} onOpenChat={handleOpenChat} />

      {/* Web Chat Floating Launcher Avatar */}
      {!showChat && <ChatFloatingButton onOpenLiveChat={handleOpenChat} />}

      {/* Web Chat Widget Modal */}
      {showChat && <WebChatWidget onClose={() => setShowChat(false)} />}

      {/* Auth Modal (Login / Register Tabs) */}
      {showAuthModal && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}
