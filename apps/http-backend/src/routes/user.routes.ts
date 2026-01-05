import { Router } from "express";
import { verifyToken } from "../middlewares/verify_token.js";
import {CreateUserSchema, SigninSchema, CreateRoomSchema} from "@repo/common/types"
import {prisma} from "@repo/db/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { createSlug } from "../utils/generateSlug.js";

const router:Router = Router();

router.post('/signup', async (req, res) => {
  
        const data = CreateUserSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        try {
            const hashedPassword = await bcrypt.hash(data.data.password, 10);

            const user = await prisma.user.create({
                data: {
                    email: data.data.email,
                    password: hashedPassword,
                    name: data.data.name,
                    username: data.data.username
                }
            })

            return res.json({
                user: user
            });
        } catch (error) {
            return res.status(411).json({ message: "User already exists" });
        }
        
});

router.post('/signin', async (req, res) => {
    const data = SigninSchema.safeParse(req.body);

    if (!data.success) {
        return res.status(400).json({ message: "Invalid input data" });
    }

    const user = await prisma.user.findFirst({ where: { email: data.data.email } });

    if(!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(data.data.password, user.password);

    if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    return res.json({
        user: user,
        token: token
    });
});

router.post('/create-room', verifyToken, (req, res) => {
    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
        return res.status(400).json({ message: "Invalid input data" });
    }
    
    try {
        const userId = req.body.userId;
        const slug = createSlug(data.data.roomName);

        const room = prisma.room.create({
            data: {
                slug: slug,
                name: data.data.roomName,
                adminId: userId
            }
        });

        return res.json({message: "Room created successfully", room: room });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Could not create room" });
    }

})

router.get('/chat/:roomId', verifyToken, async (req, res) => {
    const roomId = req.params.roomId;
    try {
        const chats = await prisma.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50
        });
        return res.json({ chats });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Could not fetch chats" });
    }
});

export default router;