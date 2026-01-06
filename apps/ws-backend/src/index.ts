import dotenv from 'dotenv';
dotenv.config();
import { WebSocketServer, WebSocket } from "ws";
import { prismaClient } from "@repo/db/client";
import { checkUser } from "./utils/checkUser.js";


interface User {
    ws: WebSocket,
    userId: string,
    roomId: string[];
}

const Users: User[] = [];

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: Number(PORT) });


wss.on('connection', function connection(ws, request) {

    console.log(`ws connected to port:${PORT}`)
    const url = request.url;
    if (url === undefined) {
        ws.close(1008, "Invalid Token");
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);

    const token = queryParams.get('token') || "";
    console.log("toekn ", queryParams);
    const userId = checkUser(token);
    console.log("userId", userId);

    if (!userId) {
        ws.close(1008, "Invalid User");
        return;
    }

    Users.push({
        ws,
        userId,
        roomId: []
    })

    ws.on('message', async function message(data) {

        const parsedData = JSON.parse(data.toString());
        const messageType = parsedData.type || "";
        console.log("MEssa", parsedData);


        switch (messageType) {
            case "join-room":
                {
                    const user = Users.find(u => u.ws === ws);

                    if (!user){
                        return ws.send(JSON.stringify({
                            message: `Invalid User`
                        }))
                    }

                    if (!user.roomId.includes(parsedData.roomId)) {
                        user.roomId.push(parsedData.roomId);
                    }

                    ws.send(JSON.stringify({
                        message: `Join Room successfully`
                    }))
                }
                break;
            case "leave-room":
                {
                    const user = Users.find(u => u.ws === ws);
                    if (!user) return;
                    user.roomId = user.roomId.filter(rid => rid !== parsedData.roomId);
                    ws.send(JSON.stringify({
                        message: `Leave Room successfully`
                    }))
                }
                break;
            case "send-message":
                {
                    try {
                        const user = Users.find(u => u.ws === ws);
                        if (!user) return;

                        const { content, roomId } = parsedData;

                        await prismaClient.chat.create({
                            data: {
                                roomId: roomId,
                                userId: user.userId,
                                content: content
                            }
                        })

                        Users.forEach(u => {
                            if (u.roomId.includes(parsedData.roomId) && u.ws!==ws) {
                                u.ws.send(JSON.stringify({
                                    type: "new-message",
                                    roomId: parsedData.roomId,
                                    fromUserId: user.userId,
                                    message: parsedData.content
                                }))
                            }
                        })

                    } catch (error) {
                        console.log("Error::ws send message:", error)
                        ws.send("Message not sended");
                    }
                }
                break;
            default:
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Unknown message type"
                }));
        }
    })
});

