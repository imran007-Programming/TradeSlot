import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/Apperror";
import { sendWhatsAppMessage } from "../../services/ultramsg.service";

const PLATFORM_FEE_CENTS = parseInt(process.env.PLATFORM_FEE_AMOUNT || "200");

const sendPaymentSuccessAutoMessage = async (bookingId: string) => {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { customer: true, conversation: true, trader: true },
        });

        if (!booking) return;

        const conversationId = booking.conversationId || booking.conversation?.id;
        if (!conversationId) return;

        const alreadySent = await prisma.message.findFirst({
            where: {
                conversationId,
                content: { contains: "Payment Received!" },
            },
        });

        if (alreadySent) return;

        const autoMsg = `✅ Payment Received! Thank you for your payment of $${booking.bookingFee}. Your booking is confirmed and ongoing. Our serviceman will call you soon!`;

        // 1. Create message in DB
        await prisma.message.create({
            data: {
                conversationId,
                sender: "TRADER",
                channel: booking.conversation?.channel || "WEB_CHAT",
                content: autoMsg,
            },
        });

        // 2. If WhatsApp, send to customer phone
        if (booking.conversation?.channel === "WHATSAPP" && booking.customer?.phone) {
            const customerPhone = booking.customer.phone;
            const toNumber = customerPhone.startsWith("+") ? customerPhone : `+${customerPhone}`;
            await sendWhatsAppMessage(toNumber, autoMsg);
        }

        console.log(`✅ Auto payment confirmation message sent for booking ${bookingId}`);
    } catch (err) {
        console.error(`Failed to send auto payment confirmation message:`, err);
    }
};

const createCheckoutSession = async (bookingId: string, userId: string) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            trader: { include: { business: true } },
            customer: true,
        },
    });

    if (!booking) throw new AppError(404, "Booking not found");

    const trader = await prisma.trader.findUnique({ where: { userId } });
    if (!trader || booking.traderId !== trader.id) {
        throw new AppError(403, "Not authorized to create payment for this booking");
    }

    const existingPayment = await prisma.payment.findUnique({ where: { bookingId } });
    if (existingPayment?.status === "SUCCEEDED") {
        throw new AppError(400, "Payment already completed for this booking");
    }

    const amountInCents = Math.round(Number(booking.bookingFee) * 100);
    if (amountInCents <= 0) throw new AppError(400, "Invalid booking fee amount");
    if (PLATFORM_FEE_CENTS >= amountInCents) throw new AppError(400, "Platform fee cannot exceed booking fee");

    const stripeConnectedId = booking.trader.business?.stripeConnectedId;
    const successUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`;
    const cancelUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/cancel?booking_id=${booking.id}`;

    const lineItems = [
        {
            price_data: {
                currency: "usd",
                product_data: {
                    name: `Booking with ${booking.trader.name}`,
                    description: `${new Date(booking.slotStart).toLocaleString()} - ${new Date(booking.slotEnd).toLocaleTimeString()}`,
                },
                unit_amount: amountInCents,
            },
            quantity: 1,
        },
    ];

    const metadata = {
        bookingId: booking.id,
        customerId: booking.customerId,
        traderId: booking.traderId,
    };

    let session;

    if (stripeConnectedId) {
        try {
            session = await stripe.checkout.sessions.create({
                mode: "payment",
                payment_method_types: ["card"],
                line_items: lineItems,
                payment_intent_data: {
                    application_fee_amount: PLATFORM_FEE_CENTS,
                    transfer_data: { destination: stripeConnectedId },
                },
                metadata,
                success_url: successUrl,
                cancel_url: cancelUrl,
            });
        } catch {
            session = await stripe.checkout.sessions.create({
                mode: "payment",
                payment_method_types: ["card"],
                line_items: lineItems,
                metadata,
                success_url: successUrl,
                cancel_url: cancelUrl,
            });
        }
    } else {
        session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: lineItems,
            metadata,
            success_url: successUrl,
            cancel_url: cancelUrl,
        });
    }

    const paymentIntentId = (session.payment_intent as string) || `session_${session.id}`;

    if (existingPayment) {
        await prisma.payment.update({
            where: { id: existingPayment.id },
            data: {
                stripePaymentIntentId: paymentIntentId,
                amount: booking.bookingFee,
                applicationFeeAmount: PLATFORM_FEE_CENTS / 100,
                status: "REQUIRES_PAYMENT",
            },
        });
    } else {
        await prisma.payment.create({
            data: {
                bookingId: booking.id,
                stripePaymentIntentId: paymentIntentId,
                amount: booking.bookingFee,
                applicationFeeAmount: PLATFORM_FEE_CENTS / 100,
                status: "REQUIRES_PAYMENT",
            },
        });
    }

    return { checkoutUrl: session.url, sessionId: session.id };
};

const handleCheckoutCompleted = async (session: any) => {
    const bookingId = session.metadata?.bookingId;
    if (!bookingId) return;

    const payment = await prisma.payment.findUnique({ where: { bookingId } });
    if (!payment) return;

    const paymentIntentId = (session.payment_intent as string) || payment.stripePaymentIntentId;

    await prisma.payment.update({
        where: { id: payment.id },
        data: {
            stripePaymentIntentId: paymentIntentId,
            ...(session.payment_status === "paid" && { status: "SUCCEEDED" }),
        },
    });

    if (session.payment_status === "paid") {
        await prisma.booking.update({
            where: { id: bookingId },
            data: { status: "CONFIRMED" },
        });
        console.log(`✅ Payment SUCCEEDED & Booking CONFIRMED: ${bookingId}`);
        await sendPaymentSuccessAutoMessage(bookingId);
    }
};

const handlePaymentSuccess = async (paymentIntent: any) => {
    const paymentIntentId = paymentIntent?.id;
    const bookingId = paymentIntent?.metadata?.bookingId;

    const payment = await prisma.payment.findFirst({
        where: {
            OR: [
                ...(paymentIntentId ? [{ stripePaymentIntentId: paymentIntentId }] : []),
                ...(bookingId ? [{ bookingId }] : []),
            ],
        },
    });

    if (!payment) {
        console.warn(`Payment not found for PaymentIntent: ${paymentIntentId}`);
        return;
    }

    await prisma.payment.update({
        where: { id: payment.id },
        data: {
            status: "SUCCEEDED",
            ...(paymentIntentId && { stripePaymentIntentId: paymentIntentId }),
        },
    });

    await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: "CONFIRMED" },
    });

    console.log(`✅ Payment SUCCEEDED for booking: ${payment.bookingId}`);
    await sendPaymentSuccessAutoMessage(payment.bookingId);
};

const handlePaymentFailed = async (paymentIntent: any) => {
    const paymentIntentId = paymentIntent?.id;
    const bookingId = paymentIntent?.metadata?.bookingId;

    const payment = await prisma.payment.findFirst({
        where: {
            OR: [
                ...(paymentIntentId ? [{ stripePaymentIntentId: paymentIntentId }] : []),
                ...(bookingId ? [{ bookingId }] : []),
            ],
        },
    });

    if (!payment) {
        console.warn(`Payment not found for PaymentIntent: ${paymentIntentId}`);
        return;
    }

    await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
    });

    console.log(`❌ Payment FAILED for booking: ${payment.bookingId}`);
};

const getPaymentByBookingId = async (bookingId: string, userId: string) => {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new AppError(404, "Booking not found");

    const trader = await prisma.trader.findUnique({ where: { userId } });
    if (!trader || booking.traderId !== trader.id) {
        throw new AppError(403, "Not authorized to view this payment");
    }

    return prisma.payment.findUnique({ where: { bookingId } });
};

const verifyAndConfirmSession = async (sessionId: string) => {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) throw new AppError(404, "Session not found");

    const bookingId = session.metadata?.bookingId;
    if (!bookingId) throw new AppError(400, "No booking linked to this session");

    if (session.payment_status === "paid") {
        await prisma.payment.updateMany({
            where: { bookingId },
            data: { status: "SUCCEEDED", stripePaymentIntentId: session.payment_intent as string },
        });
        await prisma.booking.update({
            where: { id: bookingId },
            data: { status: "CONFIRMED" },
        });
        console.log(`✅ Session verified & Booking CONFIRMED: ${bookingId}`);
        await sendPaymentSuccessAutoMessage(bookingId);
    }

    return { paid: session.payment_status === "paid", bookingId };
};

const getPaymentSummary = async (userId: string) => {
    const trader = await prisma.trader.findUnique({ where: { userId } });
    if (!trader) throw new AppError(404, "Trader not found");

    const bookings = await prisma.booking.findMany({
        where: {
            traderId: trader.id,
            status: { not: "CANCELLED" },
        },
        include: { payment: true },
    });

    let totalEarned = 0;
    let totalPending = 0;
    let succeededCount = 0;
    let pendingCount = 0;

    for (const b of bookings) {
        const fee = Number(b.bookingFee) || 0;
        if (b.payment?.status === "SUCCEEDED") {
            const appFee = Number(b.payment.applicationFeeAmount) || 0;
            totalEarned += (fee - appFee);
            succeededCount++;
        } else {
            totalPending += fee;
            pendingCount++;
        }
    }

    return { totalEarned, totalPending, succeededCount, pendingCount, totalBookings: bookings.length };
};

export const PaymentService = {
    createCheckoutSession,
    handleCheckoutCompleted,
    handlePaymentSuccess,
    handlePaymentFailed,
    verifyAndConfirmSession,
    getPaymentByBookingId,
    getPaymentSummary,
};
