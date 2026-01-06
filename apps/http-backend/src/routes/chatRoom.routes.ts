import { Router } from "express";
import { verifyToken } from "../middlewares/verify_token.js";
import { CreateRoomSchema} from "@repo/common/types"
import {prismaClient} from "@repo/db/client";
import { createSlug } from "../utils/generateSlug.js";

const router:Router = Router();

router.post('/create-room', verifyToken, async (req, res) => {
    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
        return res.status(400).json({ message: "Invalid input data" });
    }
    
    try {
        const userId = req.userId;
        const slug = await createSlug(data.data.roomName);

        const existingRoom = await prismaClient.room.findFirst({where: {slug:slug}});

        if(existingRoom){
            return res.status(409).json({message: "Room name already exists"});
        }

        if(!userId){
            return res.status(409).json({message:"Unauthorize User"})
        }

        const room = await prismaClient.room.create({
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
        const chats = await prismaClient.chat.findMany({
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

router.get('/room/:slug', verifyToken, async (req, res) => {
    try {
        const slug = req.params.slug;
        const room = await prismaClient.room.findFirst({ where: { slug: slug } });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        
        return res.json({ room });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Could not fetch roomId" });
    }
});

export default router;