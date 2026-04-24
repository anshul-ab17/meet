import { Neo4jClient } from "../client.js";

export class UserService {
  private db = Neo4jClient.getInstance();

  async createUser(id: string, name: string, hashedPassword?: string) {
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
    const session = this.db.getSession();
    await session.run(
      `MATCH (u:User {id: $id}) SET u.email = $email, u.otp = $otp, u.otpExpiresAt = $expiresAt, u.verified = false`,
      { id, email, otp, expiresAt }
    );
    await session.close();
  }

  async verifyOtp(id: string, otp: string) {
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
    const session = this.db.getSession();
    await session.run(
      `MATCH (u:User {id: $id}) SET u.verified = true, u.otp = null, u.otpExpiresAt = null`,
      { id }
    );
    await session.close();
  }

  async updateProfile(id: string, bio: string) {
    const session = this.db.getSession();
    await session.run(`MATCH (u:User {id: $id}) SET u.bio = $bio`, { id, bio });
    await session.close();
    return { id, bio };
  }

  async getUser(id: string) {
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