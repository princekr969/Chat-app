import {z} from 'zod';

export const CreateUserSchema = z.object({
    username: z.string().min(3).max(20),
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(20),
});

export const SigninSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(20),
});

export const CreateRoomSchema = z.object({
    roomName: z.string().min(3).max(30),
});