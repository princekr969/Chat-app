import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded || !(decoded as JwtPayload).userId) {
            return null;
        }
        return (decoded as JwtPayload).userId as string;
    } catch (error) {
        return null;
    }
}