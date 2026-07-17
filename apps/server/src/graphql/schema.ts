export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    bio: String
  }

  type Room {
    chatId: ID!
    name: String!
    type: String!
  }

  type Message {
    id: ID!
    content: String!
    createdAt: String!
    userId: String!
    userName: String!
  }

  type Query {
    user(id: ID!): User
    userByName(name: String!): User
    globalRoom: Room!
    channels: [Room!]!
    messages(chatId: ID!): [Message!]!
    friends: [User!]!
    pendingRequests: [User!]!
    sentRequests: [User!]!
  }

  type Mutation {
    createUser(name: String!): User!
    createChannel(name: String!): Room!
    getOrCreateDM(targetUserId: ID!): Room!
    joinRoom(userId: ID!, chatId: ID!): Boolean!
    sendFriendRequest(targetUserId: ID!): Boolean!
    acceptFriendRequest(requesterId: ID!): Boolean!
    rejectFriendRequest(requesterId: ID!): Boolean!
    cancelFriendRequest(targetUserId: ID!): Boolean!
    removeFriend(friendId: ID!): Boolean!
    updateProfile(bio: String!): User!
  }
`;
