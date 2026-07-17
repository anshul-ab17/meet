import "dotenv/config";
import { createServer } from "http";
import express, { type RequestHandler } from "express";

process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]", reason);
});
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { jwtVerify } from "jose";
import { authRoutes } from "./auth/routes.js";
import { authMiddleware } from "./auth/middleware.js";
import { userRoutes } from "./routes/userRoutes.js";
import { chatRoutes } from "./routes/chatRoutes.js";
import { dmRoutes } from "./routes/dmRoutes.js";
import { messageRoutes } from "./routes/messageRoutes.js";
import { friendRoutes } from "./routes/friendRoutes.js";
import { attachWS } from "./ws/wsServer.js";
import { ChatService, MessageService, Neo4jClient } from "@repo/db";

const PORT = 3003;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/chats", chatRoutes);
app.use("/dm", authMiddleware, dmRoutes);
app.use("/messages", authMiddleware, messageRoutes);
app.use("/friends", authMiddleware, friendRoutes);

const secret = new TextEncoder().encode(process.env["JWT_SECRET"] || "default-jwt-secret-key-1234567890");

const apollo = new ApolloServer({ typeDefs, resolvers });
await apollo.start();

app.use(
  "/graphql",
  expressMiddleware(apollo, {
    context: async ({ req }) => {
      const header = req.headers.authorization;
      if (header?.startsWith("Bearer ")) {
        try {
          const token = header.slice(7);
          const { payload } = await jwtVerify(token, secret);
          return { user: payload };
        } catch {
          // invalid token
        }
      }
      return {};
    },
  }) as unknown as RequestHandler
);

const server = createServer(app);

attachWS(server);

// Verify database connectivity
try {
  const dbClient = Neo4jClient.getInstance();
  if (!dbClient.isInMemory) {
    await dbClient.verifyConnectivity();
    console.log("✅ Neo4j connection verified successfully.");
  }
} catch (e) {
  console.warn("⚠️ Neo4j server is unreachable. Falling back to In-Memory mode.");
  Neo4jClient.getInstance().isInMemory = true;
}

// Seed global room
await new ChatService().getOrCreateGlobal();

// Cron: clear global chat messages every 24 hours
const messageService = new MessageService();
setInterval(async () => {
  await messageService.deleteGlobalMessages();
  console.log("[cron] global chat cleared");
}, 24 * 60 * 60 * 1000);

server.listen(PORT, () => {
  console.log(`http  → http://localhost:${PORT}`);
  console.log(`ws    → ws://localhost:${PORT}`);
  console.log(`gql   → http://localhost:${PORT}/graphql`);
});
