'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { setCookie } from '@/lib/cookies';
import { toast } from 'sonner';

interface Props {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', formData);

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
        onSuccess();
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl font-medium flex items-center gap-2">
          <AlertCircle size={15} className="flex-shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="e.g. 07123456789"
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/20"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/20 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer flex items-center justify-center"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff size={16} className="text-slate-400 hover:text-slate-700" />
            ) : (
              <Eye size={16} className="text-slate-400 hover:text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {/* Demo Credentials Box */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Demo Trader Account</span>
          </span>
          <button
            type="button"
            onClick={() => setFormData({ phone: '01647153126', password: '52535455' })}
            className="text-[10px] font-bold text-[#E11D48] hover:text-[#BE123C] bg-[#FFF1F2] border border-[#E11D48]/30 px-2 py-0.5 rounded-lg transition cursor-pointer hover:bg-[#FFE4E6]"
          >
            Auto Fill
          </button>
        </div>
        <div className="text-[11px] font-mono text-slate-600 flex justify-between items-center bg-white px-2.5 py-1.5 rounded-xl border border-slate-200">
          <span>Phone: <strong className="text-[#0F172A]">01647153126</strong></span>
          <span>Pass: <strong className="text-[#0F172A]">52535455</strong></span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold rounded-xl text-xs shadow-md shadow-[#E11D48]/20 disabled:opacity-50 transition cursor-pointer"
      >
        {loading ? 'Signing In...' : 'Sign In to Dashboard'}
      </button>
    </form>
  );
}
