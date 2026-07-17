import { Neo4jClient } from "../client.js";
import { friends, friendRequests, users } from "../inMemoryDb.js";

export class FriendService {
  private db = Neo4jClient.getInstance();

  async sendRequest(fromId: string, toId: string) {
    if (this.db.isInMemory) {
      friendRequests.add(`${fromId}:${toId}`);
      return { fromId, toId };
    }

    const session = this.db.getSession();
    await session.run(
      `
      MATCH (a:User {id: $fromId}), (b:User {id: $toId})
      MERGE (a)-[:SENT_REQUEST]->(b)
      `,
      { fromId, toId }
    );
    await session.close();
    return { fromId, toId };
  }

  async acceptRequest(requesterId: string, acceptorId: string) {
    if (this.db.isInMemory) {
      friendRequests.delete(`${requesterId}:${acceptorId}`);
      friendRequests.delete(`${acceptorId}:${requesterId}`);

      const pair = requesterId < acceptorId ? `${requesterId}:${acceptorId}` : `${acceptorId}:${requesterId}`;
      friends.add(pair);
      return { requesterId, acceptorId };
    }

    const session = this.db.getSession();
    await session.run(
      `
      MATCH (a:User {id: $requesterId})-[r:SENT_REQUEST]->(b:User {id: $acceptorId})
      DELETE r
      MERGE (a)-[:FRIENDS_WITH]->(b)
      MERGE (b)-[:FRIENDS_WITH]->(a)
      `,
      { requesterId, acceptorId }
    );
    await session.close();
    return { requesterId, acceptorId };
  }

  async removeFriend(userId: string, friendId: string) {
    if (this.db.isInMemory) {
      const pair = userId < friendId ? `${userId}:${friendId}` : `${friendId}:${userId}`;
      friends.delete(pair);
      return;
    }

    const session = this.db.getSession();
    await session.run(
      `
      MATCH (a:User {id: $userId})-[r:FRIENDS_WITH]->(b:User {id: $friendId})
      DELETE r
      WITH a, b
      MATCH (b)-[r2:FRIENDS_WITH]->(a)
      DELETE r2
      `,
      { userId, friendId }
    );
    await session.close();
  }

  async rejectRequest(requesterId: string, userId: string) {
    if (this.db.isInMemory) {
      friendRequests.delete(`${requesterId}:${userId}`);
      return;
    }

    const session = this.db.getSession();
    await session.run(
      `MATCH (a:User {id: $requesterId})-[r:SENT_REQUEST]->(b:User {id: $userId}) DELETE r`,
      { requesterId, userId }
    );
    await session.close();
  }

  async cancelRequest(fromId: string, toId: string) {
    if (this.db.isInMemory) {
      friendRequests.delete(`${fromId}:${toId}`);
      return;
    }

    const session = this.db.getSession();
    await session.run(
      `MATCH (a:User {id: $fromId})-[r:SENT_REQUEST]->(b:User {id: $toId}) DELETE r`,
      { fromId, toId }
    );
    await session.close();
  }

  async getFriends(userId: string) {
    if (this.db.isInMemory) {
      const list: { id: string; name: string }[] = [];
      for (const pair of friends) {
        const parts = pair.split(":");
        const a = parts[0]!;
        const b = parts[1]!;
        if (a === userId || b === userId) {
          const friendId = a === userId ? b : a;
          const u = users.get(friendId);
          if (u) {
            list.push({ id: u.id, name: u.name });
          }
        }
      }
      return list;
    }

    const session = this.db.getSession();
    const res = await session.run(
      `
      MATCH (u:User {id: $userId})-[:FRIENDS_WITH]->(f:User)
      RETURN f.id as id, f.name as name
      `,
      { userId }
    );
    await session.close();
    return res.records.map((r) => ({
      id: r.get("id") as string,
      name: r.get("name") as string,
    }));
  }

  async getPendingRequests(userId: string) {
    if (this.db.isInMemory) {
      const list: { id: string; name: string }[] = [];
      for (const req of friendRequests) {
        const parts = req.split(":");
        const fromId = parts[0]!;
        const toId = parts[1]!;
        if (toId === userId) {
          const u = users.get(fromId);
          if (u) {
            list.push({ id: u.id, name: u.name });
          }
        }
      }
      return list;
    }

    const session = this.db.getSession();
    const res = await session.run(
      `
      MATCH (from:User)-[:SENT_REQUEST]->(to:User {id: $userId})
      RETURN from.id as id, from.name as name
      `,
      { userId }
    );
    await session.close();
    return res.records.map((r) => ({
      id: r.get("id") as string,
      name: r.get("name") as string,
    }));
  }

  async getSentRequests(userId: string) {
    if (this.db.isInMemory) {
      const list: { id: string; name: string }[] = [];
      for (const req of friendRequests) {
        const parts = req.split(":");
        const fromId = parts[0]!;
        const toId = parts[1]!;
        if (fromId === userId) {
          const u = users.get(toId);
          if (u) {
            list.push({ id: u.id, name: u.name });
          }
        }
      }
      return list;
    }

    const session = this.db.getSession();
    const res = await session.run(
      `
      MATCH (from:User {id: $userId})-[:SENT_REQUEST]->(to:User)
      RETURN to.id as id, to.name as name
      `,
      { userId }
    );
    await session.close();
    return res.records.map((r) => ({
      id: r.get("id") as string,
      name: r.get("name") as string,
    }));
  }
}
