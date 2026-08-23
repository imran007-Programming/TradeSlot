'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { setCookie } from '@/lib/cookies';
import { toast } from 'sonner';

interface AuthModalProps {
  initialMode?: 'login' | 'register';
  onClose: () => void;
}

export default function AuthModal({ initialMode = 'login', onClose }: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Login form data
  const [loginData, setLoginData] = useState({
    phone: '',
    password: '',
  });

  // Register form data
  const [registerData, setRegisterData] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', loginData);

      if (response.success) {
        const accessToken = response.data?.token?.accessToken || response.data?.token;
        const refreshToken = response.data?.token?.refreshToken;

        if (accessToken) {
          setCookie('accessToken', accessToken, 1);
        }
        if (refreshToken) {
          setCookie('refreshToken', refreshToken, 1);
        }

        toast.success('Welcome back! Signed in successfully.');
        onClose();
        router.push('/dashboard');
      } else {
        const msg = response.message || 'Login failed. Please check credentials.';
        setError(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      const msg = err.message || 'An error occurred during login';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/register', registerData);

      if (response.success) {
        const token = response.data?.token?.accessToken || response.data?.token;

        if (token) {
          setCookie('accessToken', token, 1);
        }

        toast.success('Account created successfully! Welcome to TradeSlot.');
        onClose();
        router.push('/dashboard');
      } else {
        const msg = response.message || 'Registration failed. User may already exist.';
        setError(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      const msg = err.message || 'An error occurred during registration';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-5 text-slate-900 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-[#0F172A] flex items-center justify-center font-bold text-[#84EA00] shadow-md">
              ⚡
            </div>
            <span className="text-xl font-black text-[#0F172A]">Trade<span className="text-[#84EA00] font-black">Slot</span></span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Access your multi-channel intake & slot dispatch portal</p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-[#0F172A] text-[#84EA00] shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Trader Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-[#0F172A] text-[#84EA00] shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Register Account
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={loginData.phone}
                onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                placeholder="e.g. 07123456789"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#84EA00]/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#84EA00]/30 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-sm cursor-pointer"
                >
                  {showLoginPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#84EA00] hover:bg-[#74D100] text-[#0F172A] font-black rounded-xl text-xs shadow-md shadow-[#84EA00]/20 disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? 'Signing In...' : 'Sign In to Dashboard'}
            </button>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                placeholder="e.g. Alex Morgan"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#84EA00]/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Business / Trading Name
              </label>
              <input
                type="text"
                value={registerData.businessName}
                onChange={(e) => setRegisterData({ ...registerData, businessName: e.target.value })}
                placeholder="e.g. Morgan Electrical"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#84EA00]/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={registerData.phone}
                onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                placeholder="e.g. 07123456789"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#84EA00]/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                placeholder="alex@morganelectrical.com"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#84EA00]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#84EA00]/30 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-sm cursor-pointer"
                >
                  {showRegisterPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#84EA00] hover:bg-[#74D100] text-[#0F172A] font-black rounded-xl text-xs shadow-md shadow-[#84EA00]/20 disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Create Trader Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
