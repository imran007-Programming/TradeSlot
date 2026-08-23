'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');
  const [status, setStatus] = useState<'loading' | 'confirmed' | 'failed'>('loading');

  useEffect(() => {
    if (!sessionId) { setStatus('confirmed'); return; }
    fetch(`${API}/payments/verify-session?session_id=${sessionId}`)
      .then(r => r.json())
      .then(data => setStatus(data.success && data.data?.paid ? 'confirmed' : 'failed'))
      .catch(() => setStatus('failed'));
  }, [sessionId]);

  if (status === 'loading') return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center space-y-4">
        <Loader2 size={40} className="animate-spin text-emerald-500 mx-auto" />
        <p className="text-slate-500 font-medium text-sm">Confirming your payment...</p>
      </div>
    </div>
  );

  if (status === 'failed') return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center space-y-4 max-w-md w-full">
        <XCircle size={48} className="text-red-500 mx-auto" />
        <h1 className="text-xl font-bold text-red-600">Payment Not Confirmed</h1>
        <p className="text-slate-500 text-sm">Something went wrong verifying your payment. Please contact support.</p>
        {bookingId && <p className="text-xs text-slate-400 font-mono">Booking: {bookingId}</p>}
        <a href="/" className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-red-700 transition">Back to Home</a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center space-y-4 max-w-md w-full">
        <CheckCircle size={48} className="text-emerald-500 mx-auto" />
        <h1 className="text-2xl font-bold text-emerald-600">Payment Successful!</h1>
        <p className="text-slate-500 text-sm">Your booking has been confirmed and payment processed successfully.</p>
        {bookingId && <p className="text-xs text-slate-400 font-mono">Booking ID: {bookingId}</p>}
        <a href="/" className="inline-block bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition">Back to Home</a>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
