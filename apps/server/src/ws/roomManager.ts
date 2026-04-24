export class RoomManager {
  private rooms = new Map<string, Set<any>>();
  private userSockets = new Map<string, any>();

  register(userId: string, ws: any) {
    this.userSockets.set(userId, ws);
    ws.once("close", () => this.userSockets.delete(userId));
  }

  join(chatId: string, ws: any) {
    if (!this.rooms.has(chatId)) this.rooms.set(chatId, new Set());
    this.rooms.get(chatId)!.add(ws);
    ws.once("close", () => this.leave(ws));
  }

  leave(ws: any) {
    for (const clients of this.rooms.values()) clients.delete(ws);
  }

  broadcast(chatId: string, message: unknown) {
    const clients = this.rooms.get(chatId);
    if (!clients) return;
    const payload = JSON.stringify(message);
    clients.forEach((c) => { if (c.readyState === 1) c.send(payload); });
  }

  broadcastAll(message: unknown) {
    const payload = JSON.stringify(message);
    for (const ws of this.userSockets.values()) {
      if (ws.readyState === 1) ws.send(payload);
    }
  }

  sendToUser(userId: string, message: unknown) {
    const ws = this.userSockets.get(userId);
    if (ws?.readyState === 1) ws.send(JSON.stringify(message));
  }
}

export const roomManager = new RoomManager();
