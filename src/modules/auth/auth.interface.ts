import type { Role } from '../../../generated/prisma/client';

export interface IRegisterUser {
    name: string;
    email: string;
    password: string;
    role: Role;
}

export interface ILoginUser {
    email: string;
    password: string;
}