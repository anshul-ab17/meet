"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { UserPlus, Hash, Smile, Users, PlusCircle, Crown } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useUserStore } from "../store/useUserStore";
import { useFriendStore } from "../store/useFriendStore";
import { Avatar } from "./ui/avatar";
import { Tooltip } from "./ui/tooltip";
import { UserProfileModal } from "./UserProfileModal";
import { InviteToChannelModal } from "./InviteToChannelModal";
import type { Room } from "../types";

interface ChatAreaProps {
  onSendMessage: (content: string) => void;
  onOpenDM: (targetUserId: string) => Promise<Room | null>;
}

function formatFullDate(createdAt: string) {
  try {
    const date = new Date(createdAt);
    const now = new Date();
    
    const isToday = date.toDateString() === now.toDateString();
    
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    
    if (isToday) return `Today at ${timeStr}`;
    if (isYesterday) return `Yesterday at ${timeStr}`;
    return `${date.toLocaleDateString()} ${timeStr}`;
  } catch {
    return "";
  }
}

function formatShortTime(createdAt: string) {
  try {
    const date = new Date(createdAt);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  } catch {
    return "";
  }
}

export function ChatArea({ onSendMessage, onOpenDM }: ChatAreaProps) {
  const [input, setInput] = useState("");
  const [profileUser, setProfileUser] = useState<{ id: string; name: string } | null>(null);
  const [showMembers, setShowMembers] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const user = useUserStore((s) => s.user);
  const token = useUserStore((s) => s.token);
  const messages = useChatStore((s) => s.messages);
  const room = useChatStore((s) => s.currentRoom);
  const activeSection = useChatStore((s) => s.activeSection);
  const friends = useFriendStore((s) => s.friends);

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

  if (!room) return null;

  const renderContentWithMentions = (content: string) => {
    if (!user) return <span>{content}</span>;
    const hasMention = content.toLowerCase().includes(`@${user.name.toLowerCase()}`);
    if (!hasMention) return <span>{content}</span>;
    
    const parts = content.split(new RegExp(`(@${user.name})`, "gi"));
    return (
      <>
        {parts.map((part, idx) =>
          part.toLowerCase() === `@${user.name.toLowerCase()}` ? (
            <span key={idx} className="text-[#dee0fc] font-medium bg-[#5865f2]/30 rounded px-1 py-[1px] hover:bg-[#5865f2]/40 transition-colors cursor-pointer select-none">
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
    <div className="flex-1 flex min-w-0 bg-bg-base relative">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-12 flex items-center justify-between px-4 bg-bg-base border-b border-black/[0.2] z-10 shrink-0 select-none shadow-sm">
          <div className="flex items-center gap-2 min-w-0">
            {isDM ? (
              <span className="text-accent-gray font-bold text-xl select-none mr-1">@</span>
            ) : (
              <Hash size={24} className="text-accent-gray shrink-0 mr-0.5" />
            )}
            <h2 className="font-bold text-white text-[15px] tracking-tight truncate">{room.name}</h2>
            
            {!isDM && (
              <>
                <div className="w-[1px] h-4 bg-border-subtle mx-2" />
                <span className="text-accent-gray text-xs truncate font-medium">Welcome to the start of the #{room.name} channel!</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0 text-accent-gray">
            {isChannel && token && (
              <InviteToChannelModal chatId={room.chatId} channelName={room.name} token={token}>
                <Tooltip label="Create Invite">
                  <button className="hover:text-white transition-colors p-1">
                    <UserPlus size={20} />
                  </button>
                </Tooltip>
              </InviteToChannelModal>
            )}

            {!isDM && (
              <Tooltip label="Toggle Member List">
                <button 
                  onClick={() => setShowMembers(!showMembers)}
                  className={`hover:text-white transition-colors p-1 ${showMembers ? "text-white" : ""}`}
                >
                  <Users size={20} />
                </button>
              </Tooltip>
            )}
          </div>
        </header>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col custom-scrollbar relative z-0">
          {messages.length === 0 && (
            <div className="flex flex-col items-start justify-end px-4 py-8 mt-auto">
              <div className="w-16 h-16 rounded-full bg-bg-input flex items-center justify-center text-white mb-4">
                {isDM ? <span className="text-3xl">@</span> : <Hash size={36} className="text-accent-gray" />}
              </div>
              <h3 className="text-3xl font-black text-white mb-2">
                {isDM ? `Welcome to @${room.name}!` : `Welcome to #${room.name}!`}
              </h3>
              <p className="text-accent-gray text-[15px] font-normal max-w-lg leading-snug">
                {isDM 
                  ? `This is the start of your direct message history with ${room.name}.`
                  : `This is the start of the #${room.name} channel.`}
              </p>
            </div>
          )}

          {messages.map((msg, i) => {
            const isOwn = msg.userId === user?.id;
            const prev = messages[i - 1];
            const grouped = prev?.userId === msg.userId;
            
            // Group messages if they are from same user and within 3 minutes
            const isTimeGrouped = grouped && 
              (new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < 3 * 60 * 1000);

            const hasMention = user
              ? msg.content.toLowerCase().includes(`@${user.name.toLowerCase()}`)
              : false;

            const clickable = !isOwn;

            return (
              <div
                key={msg.id ?? i}
                className={`px-4 py-0.5 flex group transition-colors duration-100 ${
                  isTimeGrouped ? "py-[2px]" : "mt-4"
                } ${
                  hasMention 
                    ? "bg-[#403e2b] border-l-2 border-yellow-500/80 hover:bg-[#494630]" 
                    : "hover:bg-white/[0.015]"
                }`}
              >
                {/* Left side: Avatar or Hover Timestamp */}
                <div className="w-12 shrink-0 flex items-start justify-start">
                  {!isTimeGrouped ? (
                    <button
                      onClick={() => clickable && setProfileUser({ id: msg.userId, name: msg.userName ?? msg.userId })}
                      className={`shrink-0 w-10 h-10 rounded-full overflow-hidden mt-0.5 ${clickable ? "cursor-pointer hover:scale-105" : "cursor-default"}`}
                    >
                      <Avatar name={msg.userName ?? msg.userId} size="md" />
                    </button>
                  ) : (
                    <div className="w-10 text-right pr-3 pt-1 text-[9px] text-accent-gray opacity-0 group-hover:opacity-100 select-none transition-opacity font-medium">
                      {formatShortTime(msg.createdAt)}
                    </div>
                  )}
                </div>

                {/* Right side: Username, Timestamp, and Content */}
                <div className="flex-1 min-w-0 flex flex-col">
                  {!isTimeGrouped && (
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <button
                        onClick={() => clickable && setProfileUser({ id: msg.userId, name: msg.userName ?? msg.userId })}
                        className={`text-[14px] font-semibold text-white hover:underline cursor-pointer text-left leading-none ${
                          isOwn ? "text-accent-blurple" : "hover:text-white"
                        }`}
                      >
                        {msg.userName ?? msg.userId}
                      </button>
                      <span className="text-accent-gray text-[10px] select-none font-medium leading-none">
                        {formatFullDate(msg.createdAt)}
                      </span>
                    </div>
                  )}
                  <div className="text-accent-text text-[15px] leading-relaxed break-words pr-4 font-normal">
                    {renderContentWithMentions(msg.content)}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} className="h-4" />
        </div>

        {/* Input Footer */}
        <footer className="px-4 pb-6 pt-0 bg-transparent shrink-0">
          <form 
            onSubmit={handleSubmit} 
            className="bg-bg-input rounded-lg px-4 py-2.5 flex items-center gap-4 shadow-sm"
          >
            <button type="button" className="text-accent-gray hover:text-white transition-colors shrink-0">
              <PlusCircle size={22} />
            </button>
            
            <input
              className="flex-1 bg-transparent text-white text-[15px] outline-none placeholder-accent-gray/60 font-normal"
              placeholder={isDM ? `Message @${room.name}` : `Message #${room.name}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button type="button" className="text-accent-gray hover:text-white transition-colors shrink-0">
              <Smile size={22} />
            </button>
          </form>
        </footer>
      </div>

      {/* Right Sidebar (Members List) */}
      {showMembers && !isDM && (
        <div className="w-60 bg-bg-surface flex flex-col shrink-0 border-l border-black/[0.2] select-none p-4 overflow-y-auto custom-scrollbar">
          {/* Online Section */}
          <h3 className="text-accent-gray text-[11px] font-bold uppercase tracking-wider mb-2">
            Online — 1
          </h3>
          <div className="flex flex-col gap-1 mb-6">
            {user && (
              <div className="flex items-center gap-2 p-1.5 rounded hover:bg-white/[0.04] cursor-pointer">
                <div className="relative shrink-0">
                  <Avatar name={user.name} size="sm" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-accent-green rounded-full border-[2px] border-bg-surface" />
                </div>
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-white text-sm font-semibold truncate leading-none">{user.name}</span>
                  <span title="Server Owner" className="shrink-0"><Crown size={12} className="text-yellow-500" /></span>
                </div>
              </div>
            )}
          </div>

          {/* Offline/Members Section */}
          <h3 className="text-accent-gray text-[11px] font-bold uppercase tracking-wider mb-2">
            Members — {friends.length}
          </h3>
          <div className="flex flex-col gap-1">
            {friends.map((friend) => (
              <div 
                key={friend.id} 
                onClick={() => onOpenDM(friend.id)}
                className="flex items-center gap-2 p-1.5 rounded hover:bg-white/[0.04] cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
              >
                <div className="relative shrink-0">
                  <Avatar name={friend.name} size="sm" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-accent-gray rounded-full border-[2px] border-bg-surface" />
                </div>
                <span className="text-accent-text text-sm font-semibold truncate leading-none">{friend.name}</span>
              </div>
            ))}
            {friends.length === 0 && (
              <p className="text-accent-gray/50 text-xs italic px-1">No other members</p>
            )}
          </div>
        </div>
      )}

      {/* User profile modal */}
      {profileUser && (
        <UserProfileModal
          userId={profileUser.id}
          userName={profileUser.name}
          open={!!profileUser}
          onClose={() => setProfileUser(null)}
          onOpenDM={onOpenDM}
        />
      )}
    </div>
  );
}
