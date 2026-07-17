import { UserService, ChatService, MessageService, FriendService } from "@repo/db";
import { v4 as uuidv4 } from "uuid";
import { GraphQLError } from "graphql";
import { roomManager } from "../ws/roomManager.js";

const userService = new UserService();
const chatService = new ChatService();
const messageService = new MessageService();
const friendService = new FriendService();

interface Context {
  user?: {
    id: string;
    name: string;
  };
}

function checkAuth(context: Context) {
  if (!context.user) {
    throw new GraphQLError("Unauthorized", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
  return context.user;
}

export const resolvers: any = {
  Query: {
    user: (_: unknown, { id }: { id: string }) => userService.getUser(id),
    userByName: async (_: unknown, { name }: { name: string }, context: Context) => {
      checkAuth(context);
      return userService.getUserByName(name);
    },
    globalRoom: async (_: unknown, __: unknown, context: Context) => {
      checkAuth(context);
      return chatService.getOrCreateGlobal();
    },
    channels: async (_: unknown, __: unknown, context: Context) => {
      checkAuth(context);
      return chatService.getChannels();
    },
    messages: async (_: unknown, { chatId }: { chatId: string }, context: Context) => {
      checkAuth(context);
      return messageService.getMessages(chatId);
    },
    friends: async (_: unknown, __: unknown, context: Context) => {
      const user = checkAuth(context);
      return friendService.getFriends(user.id);
    },
    pendingRequests: async (_: unknown, __: unknown, context: Context) => {
      const user = checkAuth(context);
      return friendService.getPendingRequests(user.id);
    },
    sentRequests: async (_: unknown, __: unknown, context: Context) => {
      const user = checkAuth(context);
      return friendService.getSentRequests(user.id);
    },
  },

  Mutation: {
    createUser: (_: unknown, { name }: { name: string }) => {
      const id = uuidv4();
      return userService.createUser(id, name);
    },
    createChannel: async (_: unknown, { name }: { name: string }, context: Context) => {
      checkAuth(context);
      const room = await chatService.createChannel(name);
      roomManager.broadcastAll({ type: "channel-created", channel: room });
      return room;
    },
    getOrCreateDM: async (_: unknown, { targetUserId }: { targetUserId: string }, context: Context) => {
      const user = checkAuth(context);
      return chatService.getOrCreateDM(user.id, targetUserId);
    },
    joinRoom: async (
      _: unknown,
      { userId, chatId }: { userId: string; chatId: string },
      context: Context
    ) => {
      checkAuth(context);
      await chatService.joinRoom(userId, chatId);
      return true;
    },
    sendFriendRequest: async (_: unknown, { targetUserId }: { targetUserId: string }, context: Context) => {
      const user = checkAuth(context);
      await friendService.sendRequest(user.id, targetUserId);
      roomManager.sendToUser(targetUserId, { type: "friend-update" });
      return true;
    },
    acceptFriendRequest: async (_: unknown, { requesterId }: { requesterId: string }, context: Context) => {
      const user = checkAuth(context);
      await friendService.acceptRequest(requesterId, user.id);
      roomManager.sendToUser(requesterId, { type: "friend-update" });
      return true;
    },
    rejectFriendRequest: async (_: unknown, { requesterId }: { requesterId: string }, context: Context) => {
      const user = checkAuth(context);
      await friendService.rejectRequest(requesterId, user.id);
      return true;
    },
    cancelFriendRequest: async (_: unknown, { targetUserId }: { targetUserId: string }, context: Context) => {
      const user = checkAuth(context);
      await friendService.cancelRequest(user.id, targetUserId);
      return true;
    },
    removeFriend: async (_: unknown, { friendId }: { friendId: string }, context: Context) => {
      const user = checkAuth(context);
      await friendService.removeFriend(user.id, friendId);
      return true;
    },
    updateProfile: async (_: unknown, { bio }: { bio: string }, context: Context) => {
      const user = checkAuth(context);
      return userService.updateProfile(user.id, bio);
    },
  },
};
