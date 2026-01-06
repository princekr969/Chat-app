import { Router } from "express";
import { verifyToken } from "../middlewares/verify_token.js";
import { CreateUserSchema, SigninSchema } from "@repo/common/types"
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const router: Router = Router();

router.post('/signup', async (req, res) => {
    try {
        const data = CreateUserSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        const existingUser = await prismaClient.user.findFirst({ where: { email: data.data.email } })
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(data.data.password, 10);

        const user = await prismaClient.user.create({
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
        console.log("Error:User signup::", error);
        return res.status(500).json({ message: "Error:User signup", error });
    }

});

router.post('/signin', async (req, res) => {
    try {
        const data = SigninSchema.safeParse(req.body);

        if (!data.success) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        const email = data.data.email || undefined;
        const username = data.data.username || undefined;

        const user = await prismaClient.user.findFirst({
                    where: (email)? { email }: { username },
                });

        if (!user) {
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
    } catch (error) {
        console.log("Error:User signin::", error);
        return res.status(411).json({ message: "User already exists", error });
    }

});


export default router;