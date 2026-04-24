"use client";

import { useEffect, useRef, useCallback } from "react";
import { useChatStore } from "../store/useChatStore";
import { useNotificationStore } from "../store/useNotificationStore";
import type { Message, Room } from "../types";

const WS_URL = process.env["NEXT_PUBLIC_WS_URL"] ?? "ws://localhost:3003";

export function useWS(token: string | null, currentUserName?: string, onFriendUpdate?: () => void) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onFriendUpdateRef = useRef(onFriendUpdate);
  onFriendUpdateRef.current = onFriendUpdate;
  const addMessage = useChatStore((s) => s.addMessage);
  const addChannel = useChatStore((s) => s.addChannel);
  const addNotification = useNotificationStore((s) => s.add);

  useEffect(() => {
    if (!token) return;

    let destroyed = false;

    function connect() {
      if (destroyed) return;

      const ws = new WebSocket(`${WS_URL}?token=${token}`);
      wsRef.current = ws;

      ws.onopen = () => {
        // Re-join the current room after reconnect
        const { currentRoom } = useChatStore.getState();
        if (currentRoom) {
          ws.send(JSON.stringify({ type: "join", chatId: currentRoom.chatId }));
        }
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data as string) as Record<string, unknown>;

        switch (data["type"]) {
          case "message": {
            const msg = data["payload"] as Message;
            const state = useChatStore.getState();
            const isCurrentRoom = state.currentRoom?.chatId === msg.chatId;

            if (
              currentUserName &&
              msg.content.toLowerCase().includes(`@${currentUserName.toLowerCase()}`) &&
              msg.userId !== state.currentRoom?.participantId
            ) {
              addNotification({
                type: "mention",
                title: `${msg.userName} mentioned you`,
                body: msg.content,
              });
            }

            if (msg.chatId && !isCurrentRoom) {
              const dm = state.dms.find((d) => d.chatId === msg.chatId);
              if (dm) {
                addNotification({
                  type: "dm",
                  title: `New message from ${msg.userName}`,
                  body: msg.content,
                });
              }
            }

            addMessage(msg);
            break;
          }
          case "channel-created":
            addChannel(data["channel"] as Room);
            break;
          case "friend-update":
            onFriendUpdateRef.current?.();
            break;
        }
      };

      ws.onclose = () => {
        wsRef.current = null;
        if (!destroyed) {
          reconnectTimer.current = setTimeout(connect, 2000);
        }
      };
    }

    connect();

    return () => {
      destroyed = true;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [token]);

  const send = useCallback((data: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  const joinRoom = useCallback(
    (chatId: string) => {
      const doJoin = () => send({ type: "join", chatId });
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        doJoin();
      } else if (wsRef.current) {
        wsRef.current.addEventListener("open", doJoin, { once: true });
      }
    },
    [send]
  );

  return { send, joinRoom, wsRef };
}
