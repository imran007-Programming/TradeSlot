import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/Apperror";

/**
 * Create a Stripe Connect Express account for the trader's business.
 * Validates existing account or creates a new one.
 */
const createStripeConnectAccount = async (userId: string) => {
    const trader = await prisma.trader.findUnique({
        where: { userId },
        include: { business: true },
    });

    if (!trader) {
        throw new AppError(404, "Trader not found");
    }

    // Auto-create business if trader doesn't have one
    if (!trader.business) {
        await prisma.business.create({
            data: {
                name: `${trader.name}'s Business`,
                traders: { connect: { id: trader.id } },
            },
        });
        // Re-fetch trader with business
        const updatedTrader = await prisma.trader.findUnique({
            where: { userId },
            include: { business: true },
        });
        if (!updatedTrader?.business) throw new AppError(500, "Failed to create business");
        Object.assign(trader, updatedTrader);
    }

    // If already has a connected account, verify it still exists on Stripe
    if (trader.business.stripeConnectedId) {
        try {
            const existingAccount = await stripe.accounts.retrieve(trader.business.stripeConnectedId);
            if (existingAccount && !existingAccount.deleted) {
                return {
                    accountId: existingAccount.id,
                    alreadyExists: true,
                };
            }
        } catch (e) {
            console.log("Existing connected account invalid on Stripe. Creating new one...");
        }
    }

    // Create new Stripe Connect Express account
    const account = await stripe.accounts.create({
        type: "express",
        country: "US",
        capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
        },
        business_type: "individual",
        metadata: {
            traderId: trader.id,
            businessId: trader.business.id,
            userId: userId,
        },
    });

    // Save Stripe connected account ID to Business
    await prisma.business.update({
        where: { id: trader.business.id },
        data: { stripeConnectedId: account.id },
    });

    return {
        accountId: account.id,
        alreadyExists: false,
    };
};

/**
 * Reset/Clear Stripe Connect account for a trader so they can connect fresh.
 */
const resetStripeConnectAccount = async (userId: string) => {
    const trader = await prisma.trader.findUnique({
        where: { userId },
        include: { business: true },
    });

    if (!trader || !trader.business) {
        throw new AppError(404, "Trader business not found");
    }

    await prisma.business.update({
        where: { id: trader.business.id },
        data: { stripeConnectedId: null },
    });

    return { reset: true };
};

/**
 * Generate Stripe Connect onboarding link.
 * The trader is redirected to this URL to complete Stripe KYC/setup.
 */
const createStripeOnboardingLink = async (userId: string) => {
    const trader = await prisma.trader.findUnique({
        where: { userId },
        include: { business: true },
    });

    if (!trader) {
        throw new AppError(404, "Trader not found");
    }

    if (!trader.business?.stripeConnectedId) {
        throw new AppError(400, "Stripe account not created yet. Call connect endpoint first.");
    }

    const accountLink = await stripe.accountLinks.create({
        account: trader.business.stripeConnectedId,
        refresh_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard?stripe=refresh`,
        return_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard?stripe=success`,
        type: "account_onboarding",
    });

    return {
        onboardingUrl: accountLink.url,
    };
};

/**
 * Check if the trader's Stripe Connect account is fully onboarded.
 */
const getStripeAccountStatus = async (userId: string) => {
    const trader = await prisma.trader.findUnique({
        where: { userId },
        include: { business: true },
    });

    if (!trader) {
        throw new AppError(404, "Trader not found");
    }

    if (!trader.business?.stripeConnectedId) {
        return {
            connected: false,
            onboardingComplete: false,
            stripeAccountId: null,
        };
    }

    try {
        const account = await stripe.accounts.retrieve(trader.business.stripeConnectedId);
        return {
            connected: true,
            onboardingComplete: account.details_submitted ?? false,
            chargesEnabled: account.charges_enabled ?? false,
            payoutsEnabled: account.payouts_enabled ?? false,
            stripeAccountId: account.id,
        };
    } catch (error) {
        return {
            connected: false,
            onboardingComplete: false,
            stripeAccountId: null,
        };
    }
};

export const TraderService = {
    createStripeConnectAccount,
    resetStripeConnectAccount,
    createStripeOnboardingLink,
    getStripeAccountStatus,
};
