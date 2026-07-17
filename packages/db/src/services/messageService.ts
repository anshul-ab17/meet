import { Neo4jClient } from "../client.js";
import { messages, users } from "../inMemoryDb.js";

export class MessageService {
  private db = Neo4jClient.getInstance();

  async sendMessage(
    messageId: string,
    userId: string,
    chatId: string,
    content: string
  ) {
    const createdAt = new Date().toISOString();

    if (this.db.isInMemory) {
      if (!messages.has(chatId)) messages.set(chatId, []);
      const user = users.get(userId);
      const userName = user ? user.name : "Unknown";
      const msg = { id: messageId, userId, chatId, content, createdAt, userName };
      messages.get(chatId)!.push(msg);
      return msg;
    }

    const session = this.db.getSession();

    await session.run(
      `
      MATCH (u:User {id: $userId}), (c:ChatRoom {id: $chatId})
      CREATE (m:Message {
        id: $messageId,
        content: $content,
        createdAt: $createdAt
      })
      CREATE (u)-[:SENT]->(m)
      CREATE (m)-[:IN]->(c)
      `,
      { messageId, userId, chatId, content, createdAt }
    );

    await session.close();

    return { id: messageId, userId, chatId, content, createdAt };
  }

  async getMessages(chatId: string) {
    if (this.db.isInMemory) {
      return messages.get(chatId) || [];
    }

    const session = this.db.getSession();

    const res = await session.run(
      `
      MATCH (c:ChatRoom {id: $chatId})<-[:IN]-(m:Message)<-[:SENT]-(u:User)
      RETURN m, u.id as userId, u.name as userName
      ORDER BY m.createdAt ASC
      `,
      { chatId }
    );

    await session.close();

    return res.records.map((r) => ({
      ...(r.get("m").properties as Record<string, unknown>),
      createdAt: r.get("m").properties.createdAt as string,
      userId: r.get("userId") as string,
      userName: r.get("userName") as string,
    }));
  }

  async deleteGlobalMessages() {
    if (this.db.isInMemory) {
      messages.set("global", []);
      return;
    }

    const session = this.db.getSession();
    await session.run(
      `MATCH (m:Message)-[:IN]->(c:ChatRoom {id: 'global'}) DETACH DELETE m`
    );
    await session.close();
  }
}