import { Request } from 'express';
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/Apperror";

import { IRegister, ILogin } from "./auth.types";
import { generateToken } from '../../utils/generateToken';

const register = async (data: IRegister) => {
    const { businessName, name, phone, email, password } = data;

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { phone },
                { email },
            ],
        },
    });

    if (existingUser) {
        throw new AppError(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            phone,
            email: email || null,
            password: hashedPassword,
            role: "TRADER",
            trader: {
                create: {
                    name,
                    phone,
                    business: {
                        create: {
                            name: businessName?.trim() || `${name}'s Business`,
                        },
                    },
                },
            },
        },
        include: {
            trader: true,
        },
    });

    const token = generateToken({
        userId: user.id,
        role: user.role,
    });

    return {
        user: {
            id: user.id,
            phone: user.phone,
            email: user.email,
            role: user.role,
        },
        token,
    };
};

const login = async (data: ILogin) => {
    const { phone, password } = data;

    const user = await prisma.user.findUnique({
        where: { phone },
    });

    if (!user) {
        throw new AppError(401, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new AppError(401, "Invalid credentials");
    }

    const token = generateToken({
        userId: user.id,
        role: user.role,
    });

    if (!token) {
        throw new AppError(500, "Token generation failed");
    }

    return {
        user: {
            id: user.id,
            phone: user.phone,
            email: user.email,
            role: user.role,
        },
        token,
    };
};

const getMe = async (userId: string) => {
    const user = await prisma.user.findFirst({
        where: {
            id: userId
        },
        include: {
            trader: {
                include: {
                    business: true
                }
            }
        }
    })
    if (!user) {
        throw new AppError(404, "User not found")
    }
    return user
}

const logout = async () => {
    return {
        message: "Logged out successfully"
    }
}

export const authService = {
    register,
    login,
    getMe,
    logout
};
