import type { Role } from '../../../generated/prisma/client';

export interface IRegister {
    name: string;
    email: string;
    password: string;
    role: Role;
}

export interface ILogin {
    email: string;
    password: string;
}