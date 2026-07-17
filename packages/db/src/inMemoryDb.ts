export interface UserDB {
  id: string;
  name: string;
  password?: string;
  email?: string;
  otp?: string;
  otpExpiresAt?: number;
  verified?: boolean;
  bio?: string;
}

export interface RoomDB {
  chatId: string;
  name: string;
  type: "global" | "channel" | "dm";
}

export interface MessageDB {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  userName: string;
}

export const users = new Map<string, UserDB>([
  [
    "test-user-1",
    {
      id: "test-user-1",
      name: "testuser",
      password: "$2a$10$HRZjV9S4l/YKj52nxYvps.97/Qr/HK/lA5hf4AaaLvi27Gb77btMW", // "password123"
      email: "testuser@example.com",
      verified: true,
      bio: "Hello, I am a test user!",
    },
  ],
  [
    "test-user-2",
    {
      id: "test-user-2",
      name: "alice",
      password: "$2a$10$HRZjV9S4l/YKj52nxYvps.97/Qr/HK/lA5hf4AaaLvi27Gb77btMW", // "password123"
      email: "alice@example.com",
      verified: true,
      bio: "Alice here! Nice to meet you.",
    },
  ],
  [
    "test-user-3",
    {
      id: "test-user-3",
      name: "bob",
      password: "$2a$10$HRZjV9S4l/YKj52nxYvps.97/Qr/HK/lA5hf4AaaLvi27Gb77btMW", // "password123"
      email: "bob@example.com",
      verified: true,
      bio: "Hey, I am Bob.",
    },
  ],
]);
export const rooms = new Map<string, RoomDB>();
export const messages = new Map<string, MessageDB[]>();
export const friends = new Set<string>(["test-user-1:test-user-3"]); // "userIdA:userIdB" where userIdA < userIdB
export const friendRequests = new Set<string>(["test-user-2:test-user-1"]); // "fromId:toId"
export const roomMembers = new Map<string, Set<string>>(); // chatId -> Set of userId
