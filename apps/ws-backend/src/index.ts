import { WebSocketServer, WebSocket } from "ws";
import {prisma} from "@repo/db/client";
import { checkUser } from "./utils/checkUser.js";

interface User {
    ws : WebSocket,
    userId : string,
    roomId : string[];
}

const Users : User[] = [];

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: Number(PORT) });


wss.on('connection', function connection(ws, request) {
    
    console.log(`ws connected to port:${PORT}`)
    const url = request.url;
    if (url === undefined) {
        ws.close();
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const userId = checkUser(token);

    if(!userId){
        ws.close();
        return;
    }

    Users.push({
        ws,
        userId,
        roomId: []
    })

    ws.on('message', async function message(data) {
        const passedData = JSON.parse(data.toString());
        const messageType = passedData.type;

        switch(messageType){
            case "join-room":
                {
                    const user = Users.find(u => u.ws === ws);

                    if(!user) return;

                    if(!user.roomId.includes(passedData.roomId)){
                        user.roomId.push(passedData.roomId);
                    }
                }
                break;
            case "leave-room":
                {
                    const user = Users.find(u => u.ws === ws);
                    if(!user) return;
                    user.roomId = user.roomId.filter(rid => rid !== passedData.roomId);
                   
                }
                break;
            case "send-message":
                {
                    const user = Users.find(u => u.ws === ws);
                    if(!user) return;

                    const message = await prisma.chat.create({
                        data:{
                            roomId: passedData.roomId,
                            userId: user.userId,
                            content: passedData.message
                        }
                    })

                    Users.forEach(u => {
                        if(u.roomId.includes(passedData.roomId)){
                            u.ws.send(JSON.stringify({
                                type: "new-message",
                                roomId: passedData.roomId,
                                fromUserId: user.userId,
                                message: passedData.message
                            }))
                        }
                    })
                }    
        }
    })
});

