import { Role } from "@prisma/client";

export interface IRegister {
    businessName: string,
    name: string
    phone: string
    password: string
    email?: string

}

export interface ILogin {
    phone: string
    password: string
}