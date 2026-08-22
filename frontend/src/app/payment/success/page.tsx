'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Your booking has been confirmed and payment has been processed successfully.
        </p>
        {bookingId && (
          <p className="text-sm text-gray-500 mb-6">
            Booking ID: <span className="font-mono">{bookingId}</span>
          </p>
        )}
        <a
          href="/"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
