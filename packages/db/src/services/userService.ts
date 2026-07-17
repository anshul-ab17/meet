import { Neo4jClient } from "../client.js";
import { users } from "../inMemoryDb.js";

export class UserService {
  private db = Neo4jClient.getInstance();

  async createUser(id: string, name: string, hashedPassword?: string) {
    if (this.db.isInMemory) {
      const user = { id, name, password: hashedPassword ?? "", verified: false };
      users.set(id, user);
      return { id, name };
    }

    const session = this.db.getSession();

    await session.run(
      `
      MERGE (u:User {id: $id})
      SET u.name = $name, u.password = $password
      RETURN u
      `,
      { id, name, password: hashedPassword ?? "" }
    );

    await session.close();

    return { id, name };
  }

  async getUserByName(name: string) {
    if (this.db.isInMemory) {
      return Array.from(users.values()).find(
        (u) => u.name.toLowerCase() === name.trim().toLowerCase()
      );
    }

    const session = this.db.getSession();

    const res = await session.run(
      `MATCH (u:User {name: $name}) RETURN u`,
      { name }
    );

    await session.close();

    return res.records[0]?.get("u")?.properties as
      | { id: string; name: string; password: string }
      | undefined;
  }

  async setOtp(id: string, email: string, otp: string, expiresAt: number) {
    if (this.db.isInMemory) {
      const u = users.get(id);
      if (u) {
        u.email = email;
        u.otp = otp;
        u.otpExpiresAt = expiresAt;
        u.verified = false;
      }
      return;
    }

    const session = this.db.getSession();
    await session.run(
      `MATCH (u:User {id: $id}) SET u.email = $email, u.otp = $otp, u.otpExpiresAt = $expiresAt, u.verified = false`,
      { id, email, otp, expiresAt }
    );
    await session.close();
  }

  async verifyOtp(id: string, otp: string) {
    if (this.db.isInMemory) {
      const u = users.get(id);
      if (!u || !u.otp || !u.otpExpiresAt) return false;
      if (Date.now() > u.otpExpiresAt) return false;
      return u.otp === otp;
    }

    const session = this.db.getSession();
    const res = await session.run(
      `MATCH (u:User {id: $id}) RETURN u.otp AS otp, u.otpExpiresAt AS expiresAt`,
      { id }
    );
    await session.close();
    const record = res.records[0];
    if (!record) return false;
    const storedOtp = record.get("otp") as string | null;
    const expiresAt = record.get("expiresAt") as number | null;
    if (!storedOtp || !expiresAt) return false;
    if (Date.now() > expiresAt) return false;
    return storedOtp === otp;
  }

  async markVerified(id: string) {
    if (this.db.isInMemory) {
      const u = users.get(id);
      if (u) {
        u.verified = true;
        delete u.otp;
        delete u.otpExpiresAt;
      }
      return;
    }

    const session = this.db.getSession();
    await session.run(
      `MATCH (u:User {id: $id}) SET u.verified = true, u.otp = null, u.otpExpiresAt = null`,
      { id }
    );
    await session.close();
  }

  async updateProfile(id: string, bio: string) {
    if (this.db.isInMemory) {
      const u = users.get(id);
      if (u) {
        u.bio = bio;
      }
      return { id, bio };
    }

    const session = this.db.getSession();
    await session.run(`MATCH (u:User {id: $id}) SET u.bio = $bio`, { id, bio });
    await session.close();
    return { id, bio };
  }

  async getUser(id: string) {
    if (this.db.isInMemory) {
      return users.get(id);
    }

    const session = this.db.getSession();

    const res = await session.run(
      `
      MATCH (u:User {id: $id})
      RETURN u
      `,
      { id }
    );

    await session.close();

    return res.records[0]?.get("u")?.properties;
  }
}