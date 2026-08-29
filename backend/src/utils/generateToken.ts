import { Role } from "@prisma/client"
import jwt, { Secret } from "jsonwebtoken"

interface JwtPayload {
    userId: string
    role: Role
}

const getAccessSecret = (): Secret => (process.env.JWT_SECRET || 'tradeslot_default_access_jwt_secret') as Secret;
const getRefreshSecret = (): Secret => (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'tradeslot_default_refresh_jwt_secret') as Secret;

export const generateToken = (payload: JwtPayload) => {
    const accessToken = jwt.sign(payload, getAccessSecret(), { expiresIn: "15m" })
    const refreshToken = jwt.sign(payload, getRefreshSecret(), { expiresIn: "7d" })
    return {
        accessToken,
        refreshToken
    }
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, getAccessSecret())
}

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, getRefreshSecret())
}





