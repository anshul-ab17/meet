"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { Send, Phone, Video, UserPlus, Hash, MoreHorizontal, Smile, Plus } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useUserStore } from "../store/useUserStore";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { Tooltip } from "./ui/tooltip";
import { UserProfileModal } from "./UserProfileModal";
import { InviteToChannelModal } from "./InviteToChannelModal";
import type { Room } from "../types";

interface ChatAreaProps {
  onSendMessage: (content: string) => void;
  onStartCall?: (type: "audio" | "video") => void;
  onStartCallWithUser?: (userId: string, userName: string, type: "audio" | "video") => void;
  onOpenDM: (targetUserId: string) => Promise<Room | null>;
}

function formatTime(createdAt: string) {
  try {
    return new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function ChatArea({ onSendMessage, onStartCall, onStartCallWithUser, onOpenDM }: ChatAreaProps) {
  const [input, setInput] = useState("");
  const [profileUser, setProfileUser] = useState<{ id: string; name: string } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const user = useUserStore((s) => s.user);
  const token = useUserStore((s) => s.token);
  const messages = useChatStore((s) => s.messages);
  const room = useChatStore((s) => s.currentRoom);
  const activeSection = useChatStore((s) => s.activeSection);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const isDM = activeSection === "dm";
  const isGlobal = activeSection === "global";
  const isChannel = activeSection === "channel";
  const prefix = isGlobal ? "" : isDM ? "@" : "#";

  if (!room) return null;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-bg-base relative">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 bg-bg-base/60 backdrop-blur-xl border-b border-white/[0.05] z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-primary font-bold text-xl opacity-50">{prefix}</div>
          <h2 className="font-bold text-white text-base tracking-tight">{room.name}</h2>
          {isChannel && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ml-1" />}
        </div>

        <div className="flex items-center gap-2">
          {onStartCall && isDM && (
            <div className="flex gap-1 mr-2">
              <Tooltip label="Voice Call">
                <Button variant="ghost" size="icon" onClick={() => onStartCall("audio")} className="w-9 h-9 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl">
                  <Phone size={18} />
                </Button>
              </Tooltip>
              <Tooltip label="Video Call">
                <Button variant="ghost" size="icon" onClick={() => onStartCall("video")} className="w-9 h-9 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl">
                  <Video size={18} />
                </Button>
              </Tooltip>
            </div>
          )}

          {isChannel && token && (
            <InviteToChannelModal chatId={room.chatId} channelName={room.name} token={token}>
              <Tooltip label="Invite Friends">
                <Button variant="ghost" size="icon" className="w-9 h-9 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl mr-2">
                  <UserPlus size={18} />
                </Button>
              </Tooltip>
            </InviteToChannelModal>
          )}
          
          <Button variant="ghost" size="icon" className="w-9 h-9 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl">
            <MoreHorizontal size={18} />
          </Button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1 custom-scrollbar relative z-0">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto py-20">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5">
              {isDM ? <Smile size={32} /> : <Hash size={32} />}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {isDM ? `This is the start of your journey with ${room.name}` : `Welcome to the ${room.name} hub`}
            </h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              {isDM ? "Send a message to break the ice and start connecting." : "Share ideas, collaborate, and keep the conversation flowing in this channel."}
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isOwn = msg.userId === user?.id;
          const prev = messages[i - 1];
          const grouped = prev?.userId === msg.userId;
          const clickable = !isOwn;
          const hasMention = user
            ? msg.content.toLowerCase().includes(`@${user.name.toLowerCase()}`)
            : false;

          const renderContent = () => {
            if (!user || !hasMention) return <span>{msg.content}</span>;
            const parts = msg.content.split(new RegExp(`(@${user.name})`, "gi"));
            return (
              <>
                {parts.map((part, idx) =>
                  part.toLowerCase() === `@${user.name.toLowerCase()}` ? (
                    <span key={idx} className="text-primary font-bold bg-primary/10 rounded px-1">
                      {part}
                    </span>
                  ) : (
                    part
                  )
                )}
              </>
            );
          };

          return (
            <div
              key={msg.id ?? i}
              className={`flex flex-col ${grouped ? "mt-0.5" : "mt-6"} group ${
                hasMention ? "bg-primary/5 -mx-4 px-4 py-1 rounded-2xl" : ""
              }`}
            >
              {!grouped && (
                <div className={`flex items-baseline gap-3 mb-1.5 ${isOwn ? "flex-row-reverse px-2" : "px-2"}`}>
                  <button
                    onClick={() => clickable && setProfileUser({ id: msg.userId, name: msg.userName ?? msg.userId })}
                    className={`text-[13px] font-bold transition-colors ${
                      isOwn ? "text-primary hover:text-primary-hover" : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {msg.userName ?? msg.userId}
                  </button>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              )}

              <div className={`flex items-end gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                {!grouped ? (
                  <button
                    onClick={() => clickable && setProfileUser({ id: msg.userId, name: msg.userName ?? msg.userId })}
                    className={`shrink-0 transition-all duration-300 ${clickable ? "hover:scale-110 active:scale-95" : "cursor-default"}`}
                  >
                    <Avatar name={msg.userName ?? msg.userId} size="sm" className={`ring-2 ${isOwn ? "ring-primary/20" : "ring-white/5"}`} />
                  </button>
                ) : (
                  <div className="w-8 shrink-0" />
                )}

                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-200 group-hover:shadow-md ${
                  isOwn 
                    ? "bg-primary text-white rounded-br-none" 
                    : "bg-bg-input text-gray-200 rounded-bl-none group-hover:bg-white/[0.08]"
                }`}>
                  {renderContent()}
                </div>

                {!isDM && !isOwn && !grouped && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                    <Tooltip label="Call">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-primary/10 text-gray-500 hover:text-primary"
                        onClick={() => onStartCallWithUser?.(msg.userId, msg.userName ?? msg.userId, "audio")}
                      >
                        <Phone size={14} />
                      </Button>
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Input Area */}
      <footer className="px-6 pb-6 pt-2 bg-gradient-to-t from-bg-base to-transparent z-10 shrink-0">
        <form 
          onSubmit={handleSubmit} 
          className="flex items-center gap-3 bg-bg-input/80 backdrop-blur-md border border-white/[0.05] rounded-2xl px-4 py-2 shadow-xl focus-within:border-primary/30 focus-within:bg-bg-input transition-all duration-300"
        >
          <Button type="button" variant="ghost" size="icon" className="shrink-0 text-gray-500 hover:text-gray-300 w-9 h-9">
            <Plus size={20} />
          </Button>
          
          <input
            className="flex-1 bg-transparent py-2 text-white text-sm outline-none placeholder-gray-600 font-light"
            placeholder={`Message ${prefix}${room.name}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="flex items-center gap-1 shrink-0">
            <Button type="button" variant="ghost" size="icon" className="text-gray-500 hover:text-gray-300 w-9 h-9">
              <Smile size={20} />
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim()}
              className={`shrink-0 w-9 h-9 rounded-xl transition-all duration-300 ${
                input.trim()
                  ? "bg-primary text-white shadow-glow-sm scale-100"
                  : "bg-transparent text-gray-600 scale-90 opacity-50"
              }`}
            >
              <Send size={18} />
            </Button>
          </div>
        </form>
      </footer>

      {/* Profile modal */}
      {profileUser && (
        <UserProfileModal
          userId={profileUser.id}
          userName={profileUser.name}
          open={!!profileUser}
          onClose={() => setProfileUser(null)}
          onStartCall={(uid, uname, type) => onStartCallWithUser?.(uid, uname, type)}
          onOpenDM={onOpenDM}
        />
      )}
    </div>
  );
}

