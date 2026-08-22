import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    console.warn('WARNING: STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(stripeSecretKey || '', {
    apiVersion: '2026-07-29.dahlia',
});
