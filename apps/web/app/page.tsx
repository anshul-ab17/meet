"use client";

import { useEffect, useCallback, useRef } from "react";
import { useUserStore } from "./store/useUserStore";
import { useChatStore } from "./store/useChatStore";
import { useFriendStore } from "./store/useFriendStore";
import { useNotificationStore } from "./store/useNotificationStore";
import { useWS } from "./hooks/useWS";
import { HeroSection } from "./components/HeroSection";
import { Sidebar } from "./components/Sidebar";
import { ChatArea } from "./components/ChatArea";
import { FriendsPanel } from "./components/FriendsPanel";
import { NotificationToast } from "./components/NotificationToast";
import { TooltipProvider } from "./components/ui/tooltip";
import type { Friend, Room } from "./types";
import { graphqlRequest } from "./lib/graphql";

const API_URL = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3003";

export default function Home() {
  const user = useUserStore((s) => s.user);
  const token = useUserStore((s) => s.token);

  const {
    globalRoom, channels,
    currentRoom, activeSection,
    setGlobalRoom, setChannels, addDM,
    setCurrentRoom, setMessages,
  } = useChatStore();

  const { setFriends, setPendingIn, setPendingOut } = useFriendStore();
  const pendingIn = useFriendStore((s) => s.pendingIn);
  const addNotification = useNotificationStore((s) => s.add);
  const prevPendingInCountRef = useRef(0);

  const loadFriends = useCallback(async () => {
    try {
      const data = await graphqlRequest(`
        query {
          friends { id name }
          pendingRequests { id name }
          sentRequests { id name }
        }
      `, undefined, token);
      setFriends(data.friends || []);
      setPendingIn(data.pendingRequests || []);
      setPendingOut(data.sentRequests || []);
    } catch (e) {
      console.error("loadFriends error:", e);
    }
  }, [token, setFriends, setPendingIn, setPendingOut]);

  const { send, joinRoom } = useWS(token, user?.name, loadFriends);

  // Load initial data
  useEffect(() => {
    if (!user || !token) return;

    graphqlRequest(`
      query {
        globalRoom { chatId name type }
        channels { chatId name type }
      }
    `, undefined, token).then((data) => {
      if (data.globalRoom) setGlobalRoom(data.globalRoom);
      if (data.channels) setChannels(data.channels);
    }).catch(console.error);

    loadFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, token, loadFriends, setGlobalRoom, setChannels]);

  // Notify on new friend requests
  useEffect(() => {
    if (pendingIn.length > prevPendingInCountRef.current) {
      const newest = pendingIn[pendingIn.length - 1];
      if (newest) {
        addNotification({
          type: "friend_request",
          title: "Friend Request",
          body: `${newest.name} sent you a friend request`,
        });
      }
    }
    prevPendingInCountRef.current = pendingIn.length;
  }, [pendingIn, addNotification]);

  // Join room + load history whenever the room changes
  useEffect(() => {
    if (!currentRoom || !user || !token) return;
    let cancelled = false;

    joinRoom(currentRoom.chatId);

    graphqlRequest(`
      query GetMessages($chatId: ID!) {
        messages(chatId: $chatId) {
          id
          content
          createdAt
          userId
          userName
        }
      }
    `, { chatId: currentRoom.chatId }, token)
      .then((data) => {
        if (!cancelled && data.messages) setMessages(data.messages);
      })
      .catch(console.error);

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom?.chatId, user?.id, token, joinRoom, setMessages]);

  // Auto-select global room once loaded
  useEffect(() => {
    if (globalRoom && !currentRoom) setCurrentRoom(globalRoom);
  }, [globalRoom, currentRoom, setCurrentRoom]);

  const handleSendMessage = (content: string) => {
    if (!currentRoom || !user) return;
    send({ type: "message", chatId: currentRoom.chatId, userId: user.id, userName: user.name, content });
  };

  const handleCreateChannel = async (name: string) => {
    try {
      const data = await graphqlRequest(`
        mutation CreateChannel($name: String!) {
          createChannel(name: $name) {
            chatId
            name
            type
          }
        }
      `, { name }, token);
      const room = data.createChannel as Room;
      setChannels([...channels, room]);
      setCurrentRoom(room);
      useChatStore.getState().setActiveSection("channel");
    } catch (e) {
      console.error("createChannel error:", e);
    }
  };

  const handleOpenDM = async (targetUserId: string, targetUserName?: string): Promise<Room | null> => {
    try {
      const data = await graphqlRequest(`
        mutation GetOrCreateDM($targetUserId: ID!) {
          getOrCreateDM(targetUserId: $targetUserId) {
            chatId
            name
            type
          }
        }
      `, { targetUserId }, token);
      const raw = data.getOrCreateDM as Room;
      const room: Room = { ...raw, name: targetUserName ?? raw.name, participantId: targetUserId };
      addDM(room);
      setCurrentRoom(room);
      useChatStore.getState().setActiveSection("dm");
      return room;
    } catch {
      return null;
    }
  };

  if (!user || !token) {
    return (
      <TooltipProvider>
        <HeroSection />
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-bg-base text-white overflow-hidden">
        <Sidebar onCreateChannel={handleCreateChannel} onOpenDM={handleOpenDM} />

        <div className="flex-1 flex min-w-0">
          {activeSection === "friends" ? (
            <FriendsPanel
              token={token}
              onOpenDM={handleOpenDM}
              onRefresh={loadFriends}
            />
          ) : currentRoom ? (
            <ChatArea
              onSendMessage={handleSendMessage}
              onOpenDM={handleOpenDM}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
              Select a channel to get started
            </div>
          )}
        </div>

        <NotificationToast />
      </div>
    </TooltipProvider>
  );
}
