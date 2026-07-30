"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { UserPlus, Hash, Smile, Users, PlusCircle, PhoneOff, Video, Mic, ScreenShare, Grid2x2, MoreVertical, Radio } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useUserStore } from "../store/useUserStore";
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
    return new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
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
            <span key={idx} className="cursor-pointer rounded bg-[#f0b46a]/25 px-1 py-[1px] font-medium text-[#f3c98a] hover:bg-[#f0b46a]/40">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const participants = [
    { name: "Richard Wilson", live: true },
    { name: "Jenna Ortiz", live: false },
    { name: "You", live: false },
  ];

  return (
    <div className="relative flex min-w-0 flex-1 bg-[#0d0d0f]">
      {/* Main Chat Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="z-10 flex h-12 shrink-0 items-center justify-between border-b border-black/30 bg-[#0d0d0f] px-4 shadow-sm">
          <div className="flex min-w-0 items-center gap-2">
            {isDM ? (
              <span className="mr-1 select-none text-xl font-bold text-accent-gray">@</span>
            ) : (
              <Hash size={22} className="mr-0.5 shrink-0 text-accent-gray" />
            )}
            <h2 className="truncate text-[15px] font-bold tracking-tight text-white">{room.name}</h2>
            {!isDM && (
              <>
                <div className="mx-2 h-4 w-[1px] bg-border-subtle" />
                <span className="truncate text-xs font-medium text-accent-gray">Welcome to the start of #{room.name}!</span>
              </>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3 text-accent-gray">
            {isChannel && token && (
              <InviteToChannelModal chatId={room.chatId} channelName={room.name} token={token}>
                <Tooltip label="Create Invite">
                  <button className="p-1 transition-colors hover:text-white">
                    <UserPlus size={20} />
                  </button>
                </Tooltip>
              </InviteToChannelModal>
            )}
            {!isDM && (
              <Tooltip label="Toggle Member List">
                <button
                  onClick={() => setShowMembers(!showMembers)}
                  className={`p-1 transition-colors hover:text-white ${showMembers ? "text-white" : ""}`}
                >
                  <Users size={20} />
                </button>
              </Tooltip>
            )}
          </div>
        </header>

        {/* Messages Stream */}
        <div className="custom-scrollbar relative z-0 flex flex-1 flex-col overflow-y-auto py-4">
          {messages.length === 0 && (
            <div className="mt-auto flex flex-col items-start justify-end px-4 py-8">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.06] text-white">
                {isDM ? <span className="text-3xl">@</span> : <Hash size={36} className="text-accent-gray" />}
              </div>
              <h3 className="mb-2 text-3xl font-black text-white">
                {isDM ? `Welcome to @${room.name}!` : `Welcome to #${room.name}!`}
              </h3>
              <p className="max-w-lg text-[15px] font-normal leading-snug text-accent-gray">
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
            const isTimeGrouped =
              grouped && new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < 3 * 60 * 1000;
            const hasMention = user ? msg.content.toLowerCase().includes(`@${user.name.toLowerCase()}`) : false;
            const clickable = !isOwn;

            return (
              <div
                key={msg.id ?? i}
                className={`flex px-4 py-0.5 transition-colors duration-100 group ${
                  isTimeGrouped ? "py-[2px]" : "mt-4"
                } ${
                  hasMention
                    ? "border-l-2 border-[#f0b46a]/80 bg-[#f0b46a]/[0.06] hover:bg-[#f0b46a]/[0.09]"
                    : "hover:bg-white/[0.015]"
                }`}
              >
                <div className="flex w-12 shrink-0 items-start justify-start">
                  {!isTimeGrouped ? (
                    <button
                      onClick={() => clickable && setProfileUser({ id: msg.userId, name: msg.userName ?? msg.userId })}
                      className={`mt-0.5 h-10 w-10 shrink-0 overflow-hidden rounded-full ${clickable ? "cursor-pointer hover:scale-105" : "cursor-default"}`}
                    >
                      <Avatar name={msg.userName ?? msg.userId} size="md" />
                    </button>
                  ) : (
                    <div className="w-10 select-none pt-1 pr-3 text-right text-[9px] font-medium text-accent-gray opacity-0 transition-opacity group-hover:opacity-100">
                      {formatShortTime(msg.createdAt)}
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  {!isTimeGrouped && (
                    <div className="mb-0.5 flex items-baseline gap-2">
                      <button
                        onClick={() => clickable && setProfileUser({ id: msg.userId, name: msg.userName ?? msg.userId })}
                        className={`text-[14px] font-semibold leading-none text-white text-left hover:underline ${
                          isOwn ? "text-[#f0b46a]" : "hover:text-white"
                        }`}
                      >
                        {msg.userName ?? msg.userId}
                      </button>
                      <span className="select-none text-[10px] font-medium leading-none text-accent-gray">
                        {formatFullDate(msg.createdAt)}
                      </span>
                    </div>
                  )}
                  <div className="break-words pr-4 font-normal text-[15px] leading-relaxed text-accent-text">
                    {renderContentWithMentions(msg.content)}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} className="h-4" />
        </div>

        {/* Input Footer */}
        <footer className="shrink-0 bg-transparent px-4 pb-6 pt-0">
          <form onSubmit={handleSubmit} className="flex items-center gap-4 rounded-xl bg-white/[0.05] px-4 py-2.5 shadow-sm">
            <button type="button" className="shrink-0 text-accent-gray transition-colors hover:text-white">
              <PlusCircle size={22} />
            </button>
            <input
              className="flex-1 bg-transparent font-normal text-[15px] text-white outline-none placeholder:text-accent-gray/60"
              placeholder={isDM ? `Message @${room.name}` : `Message #${room.name}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="button" className="shrink-0 text-accent-gray transition-colors hover:text-white">
              <Smile size={22} />
            </button>
          </form>
        </footer>
      </div>

      {/* Right Call / Video Panel */}
      {showMembers && !isDM && (
        <div className="flex w-[340px] shrink-0 flex-col gap-3 overflow-y-auto border-l border-black/30 bg-[#0a0a0c] p-3 custom-scrollbar">
          {/* Main stream */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#1b2233] via-[#0e1320] to-[#2a2030]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(240,180,106,0.18),transparent_60%)]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
              <Radio size={26} className="text-[#f0b46a]" />
              <div>
                <p className="text-sm font-semibold text-white">Richard Wilson started streaming</p>
                <p className="text-[12px] text-accent-gray">Elden Ring — shadow of the tree</p>
              </div>
              <button className="mt-1 rounded-full bg-[#f0b46a] px-6 py-1.5 text-sm font-bold text-black transition-transform hover:scale-105">
                Join
              </button>
            </div>
          </div>

          {/* Participant grid */}
          <div className="grid grid-cols-3 gap-2">
            {participants.map((p) => (
              <div key={p.name} className="relative aspect-video overflow-hidden rounded-xl bg-white/[0.05] ring-1 ring-white/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Avatar name={p.name} size="md" />
                </div>
                {p.live && (
                  <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-accent-green/90 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" /> LIVE
                  </span>
                )}
                <span className="absolute bottom-1 left-1.5 text-[10px] font-medium text-white/90">{p.name}</span>
                {p.name === "You" && (
                  <Mic size={12} className="absolute right-1.5 top-1.5 text-white/70" />
                )}
              </div>
            ))}
          </div>

          {/* Control bar */}
          <div className="mt-auto flex items-center justify-center gap-2 rounded-2xl bg-white/[0.04] px-3 py-2.5">
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-white transition-colors hover:bg-white/10">
              <Mic size={16} />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-white transition-colors hover:bg-white/10">
              <Video size={16} />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f23f43] text-white transition-transform hover:scale-105">
              <PhoneOff size={16} />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-white transition-colors hover:bg-white/10">
              <ScreenShare size={16} />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-white transition-colors hover:bg-white/10">
              <Grid2x2 size={16} />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-white transition-colors hover:bg-white/10">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>
      )}

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
