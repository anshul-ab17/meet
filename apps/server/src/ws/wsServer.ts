import { WebSocketServer, type WebSocket } from "ws";
import type { IncomingMessage, Server } from "http";
import { jwtVerify } from "jose";
import { roomManager } from "./roomManager.js";
import { MessageService } from "@repo/db";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const messageService = new MessageService();
const secret = new TextEncoder().encode(process.env["JWT_SECRET"] ?? "");

const wsMessage = z.discriminatedUnion("type", [
  z.object({ type: z.literal("join"), chatId: z.string().min(1) }),
  z.object({
    type: z.literal("message"),
    chatId: z.string().min(1),
    userId: z.string().min(1),
    userName: z.string().min(1),
    content: z.string().min(1),
  }),
]);

export function attachWS(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const token = url.searchParams.get("token");

    if (!token) {
      ws.close(1008, "Unauthorized");
      return;
    }

    let userId: string;

    try {
      const { payload } = await jwtVerify(token, secret);
      userId = payload["id"] as string;
    } catch {
      ws.close(1008, "Invalid token");
      return;
    }

    roomManager.register(userId, ws);

    ws.on("message", async (raw) => {
      try {
        const parsed = wsMessage.safeParse(JSON.parse(raw.toString()));
        if (!parsed.success) return;

        const data = parsed.data;

        if (data.type === "join") {
          roomManager.join(data.chatId, ws);
          return;
        }

        if (data.type === "message") {
          const saved = await messageService.sendMessage(
            uuidv4(),
            data.userId,
            data.chatId,
            data.content
          );

          roomManager.broadcast(data.chatId, {
            type: "message",
            payload: { ...saved, userName: data.userName },
          });
          return;
        }
      } catch (err) {
        console.error("ws error:", err);
      }
    });

  });
}
