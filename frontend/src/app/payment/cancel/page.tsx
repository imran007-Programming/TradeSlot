'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CancelContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
        <div className="text-6xl mb-6">❌</div>
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was not completed. You can try again or contact the trader for assistance.
        </p>
        {bookingId && (
          <p className="text-sm text-gray-500 mb-6">
            Booking ID: <span className="font-mono">{bookingId}</span>
          </p>
        )}
        <div className="space-y-3">
          <a
            href="/"
            className="inline-block w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    }>
      <CancelContent />
    </Suspense>
  );
}
