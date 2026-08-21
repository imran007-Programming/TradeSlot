import { Role } from "@prisma/client"
import jwt, { Secret, SignOptions } from "jsonwebtoken"

interface JwtPayload {
    userId: string
    role: Role
}

export const generateToken = (payload: JwtPayload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as Secret, { expiresIn: "1d" })
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET as Secret, { expiresIn: "1d" })
    return {
        accessToken,
        refreshToken
    }
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET as Secret)
}





