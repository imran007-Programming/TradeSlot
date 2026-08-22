import { Request, Response, NextFunction } from "express";
import { TraderService } from "./trader.service";
import { sendResponse } from "../../utils/response";
import { AppError } from "../../utils/Apperror";

/**
 * Create Stripe Connect account and return onboarding link.
 * Single endpoint that creates account + generates onboarding URL.
 */
export const stripeConnectController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            throw new AppError(401, "User not authenticated");
        }

        // Step 1: Create or get existing Stripe account
        const account = await TraderService.createStripeConnectAccount(userId);

        // Step 2: Generate onboarding link
        const link = await TraderService.createStripeOnboardingLink(userId);

        return sendResponse(res, {
            success: true,
            message: account.alreadyExists
                ? "Stripe account already exists. Onboarding link generated."
                : "Stripe Connect account created. Complete onboarding.",
            statusCode: 200,
            data: {
                accountId: account.accountId,
                onboardingUrl: link.onboardingUrl,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Reset Stripe Connect account.
 */
export const stripeResetController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            throw new AppError(401, "User not authenticated");
        }

        await TraderService.resetStripeConnectAccount(userId);

        return sendResponse(res, {
            success: true,
            message: "Stripe account reset successfully. You can now connect fresh.",
            statusCode: 200,
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get Stripe Connect account status.
 */
export const stripeStatusController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            throw new AppError(401, "User not authenticated");
        }

        const status = await TraderService.getStripeAccountStatus(userId);

        return sendResponse(res, {
            success: true,
            message: "Stripe account status retrieved",
            statusCode: 200,
            data: status,
        });
    } catch (error) {
        next(error);
    }
};
