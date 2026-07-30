"use client";

import { Globe, Hash, Compass, Plus, LogOut, ChevronDown, Users, Search, MessageSquare, Mic, Headphones, Settings } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useFriendStore } from "../store/useFriendStore";
import { useUserStore } from "../store/useUserStore";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { Tooltip } from "./ui/tooltip";
import { CreateChannelModal } from "./CreateChannelModal";
import { EditProfileModal } from "./EditProfileModal";
import type { Room } from "../types";

interface SidebarProps {
  onCreateChannel: (name: string) => Promise<void>;
  onOpenDM: (targetUserId: string, targetUserName?: string) => Promise<Room | null>;
}

export function Sidebar({ onCreateChannel, onOpenDM }: SidebarProps) {
  const { globalRoom, channels, currentRoom, activeSection, setCurrentRoom, setActiveSection } = useChatStore();
  const { friends, pendingIn } = useFriendStore();
  const { user, clearUser } = useUserStore();

  const selectRoom = (room: Room, section: "global" | "channel" | "dm") => {
    setCurrentRoom(room);
    setActiveSection(section);
  };

  const handleFriendDM = async (friendId: string, friendName: string) => {
    const room = await onOpenDM(friendId, friendName);
    if (room) {
      setCurrentRoom(room);
      setActiveSection("dm");
    }
  };

  const handleHomeClick = () => setActiveSection("friends");

  const handleMeetServerClick = () => {
    setActiveSection("channel");
    if (channels.length > 0) {
      const isCurrentChannel = currentRoom && channels.some((c) => c.chatId === currentRoom.chatId);
      if (!isCurrentChannel) setCurrentRoom(channels[0] ?? null);
    }
  };

  const handleGlobalDiscoveryClick = () => {
    if (globalRoom) {
      setCurrentRoom(globalRoom);
      setActiveSection("global");
    }
  };

  const activeDMParticipantId = activeSection === "dm" ? currentRoom?.participantId : undefined;
  const isHome = activeSection === "friends" || activeSection === "dm";

  const navItem = (active: boolean) =>
    `flex items-center gap-3 w-full rounded-xl px-2.5 py-1.5 transition-all duration-200 ${
      active ? "bg-[#f0b46a]/15 text-white" : "text-accent-gray hover:bg-white/[0.04] hover:text-accent-text"
    }`;

  const navIcon = (active: boolean) =>
    `flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
      active ? "border-[#f0b46a] bg-[#f0b46a] text-black" : "border-white/10 bg-white/[0.03] text-accent-gray"
    }`;

  return (
    <div className="flex h-full shrink-0 font-sans select-none">
      {/* 1. Server rail (72px) — circular icon nav */}
      <div className="flex w-[72px] shrink-0 flex-col items-center gap-2 bg-[#0a0a0c] py-3">
        <Tooltip label="Direct Messages">
          <button onClick={handleHomeClick} className="group flex w-12 flex-col items-center gap-1 transition-all">
            <span className={navIcon(isHome)}>
              <MessageSquare size={18} />
            </span>
          </button>
        </Tooltip>

        <div className="my-1 h-[2px] w-8 rounded bg-border-subtle" />

        <Tooltip label="Meet Server">
          <button onClick={handleMeetServerClick} className="group flex w-12 flex-col items-center gap-1 transition-all">
            <span className={navIcon(activeSection === "channel")}>M</span>
          </button>
        </Tooltip>

        {globalRoom && (
          <Tooltip label="Global Discovery">
            <button onClick={handleGlobalDiscoveryClick} className="group flex w-12 flex-col items-center gap-1 transition-all">
              <span className={navIcon(activeSection === "global")}>
                <Compass size={18} />
              </span>
            </button>
          </Tooltip>
        )}

        <CreateChannelModal onCreate={onCreateChannel}>
          <Tooltip label="Add a Channel">
            <button className="group mt-1 flex w-12 flex-col items-center gap-1">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-white/15 bg-white/[0.03] text-accent-green transition-all hover:border-accent-green hover:bg-accent-green hover:text-black">
                <Plus size={18} />
              </span>
            </button>
          </Tooltip>
        </CreateChannelModal>
      </div>

      {/* 2. Channel list (240px) */}
      <div className="flex w-[248px] shrink-0 flex-col overflow-hidden bg-[#131316]">
        {/* Header + search */}
        <div className="shrink-0 border-b border-black/30 px-3 pb-3 pt-3">
          {isHome ? (
            <div className="mb-3 flex h-9 items-center px-1 text-sm font-bold text-white">Direct Messages</div>
          ) : (
            <button className="mb-3 flex w-full items-center justify-between px-1 text-sm font-bold text-white transition-colors hover:opacity-80">
              <span className="truncate">Meet Server</span>
              <ChevronDown size={18} className="text-accent-gray" />
            </button>
          )}
          <div className="flex items-center gap-2 rounded-full bg-white/[0.05] px-3 py-1.5">
            <Search size={15} className="text-accent-gray" />
            <input
              placeholder="Search"
              className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-accent-gray/60"
            />
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-2 py-3 custom-scrollbar">
          {isHome ? (
            <>
              <button
                onClick={() => setActiveSection("friends")}
                className={`${navItem(activeSection === "friends")} mb-3`}
              >
                <span className={navIcon(activeSection === "friends")}>
                  <Users size={18} />
                </span>
                <span className="text-[13px] font-semibold">Friends</span>
                {pendingIn.length > 0 && (
                  <span className="ml-auto rounded-full bg-accent-red px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {pendingIn.length}
                  </span>
                )}
              </button>

              <p className="px-2.5 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-accent-gray/70">
                Direct Messages
              </p>

              <div className="flex flex-col gap-0.5">
                {friends.map((friend) => {
                  const isActive = activeDMParticipantId === friend.id;
                  return (
                    <button
                      key={friend.id}
                      onClick={() => handleFriendDM(friend.id, friend.name)}
                      className={`${navItem(isActive)}`}
                    >
                      <span className={navIcon(isActive)}>
                        <Avatar name={friend.name} size="sm" />
                      </span>
                      <span className="truncate text-[13px] font-medium">{friend.name}</span>
                    </button>
                  );
                })}
                {friends.length === 0 && (
                  <p className="px-3 py-1 text-xs italic font-light text-accent-gray/50">Start a conversation</p>
                )}
              </div>
            </>
          ) : (
            <>
              {globalRoom && (
                <button onClick={() => selectRoom(globalRoom, "global")} className={`${navItem(activeSection === "global")} mb-3`}>
                  <span className={navIcon(activeSection === "global")}>
                    <Globe size={18} />
                  </span>
                  <span className="text-[13px] font-semibold">Global Discovery</span>
                </button>
              )}

              <div className="flex items-center justify-between px-2.5 pb-1 pt-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent-gray/70">Text Channels</p>
                <CreateChannelModal onCreate={onCreateChannel}>
                  <button title="Create Channel" className="text-accent-gray transition-colors hover:text-white">
                    <Plus size={16} />
                  </button>
                </CreateChannelModal>
              </div>

              <div className="flex flex-col gap-0.5">
                {channels.map((room) => {
                  const isActive = currentRoom?.chatId === room.chatId && activeSection === "channel";
                  return (
                    <button key={room.chatId} onClick={() => selectRoom(room, "channel")} className={`${navItem(isActive)}`}>
                      <span className={navIcon(isActive)}>
                        <Hash size={16} />
                      </span>
                      <span className="truncate text-[13px] font-medium lowercase">{room.name}</span>
                    </button>
                  );
                })}
                {channels.length === 0 && (
                  <p className="px-3 py-1 text-xs italic font-light text-accent-gray/50">No channels created</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* User status footer */}
        <div className="flex h-[52px] shrink-0 items-center justify-between border-t border-black/30 bg-[#0d0d0f] px-2">
          {user && (
            <>
              <EditProfileModal>
                <div className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded p-1 hover:bg-white/[0.05]">
                  <Avatar name={user.name} size="sm" />
                  <div className="flex min-w-0 flex-col leading-none">
                    <span className="truncate text-xs font-semibold text-white">{user.name}</span>
                    <span className="mt-0.5 truncate text-[10px] text-accent-gray">Online</span>
                  </div>
                </div>
              </EditProfileModal>

              <div className="flex shrink-0 items-center">
                <Tooltip label="Mute">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded text-accent-gray hover:bg-white/[0.05] hover:text-white">
                    <Mic size={16} />
                  </Button>
                </Tooltip>
                <Tooltip label="Deafen">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded text-accent-gray hover:bg-white/[0.05] hover:text-white">
                    <Headphones size={16} />
                  </Button>
                </Tooltip>
                <EditProfileModal>
                  <Tooltip label="User Settings">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded text-accent-gray hover:bg-white/[0.05] hover:text-white">
                      <Settings size={16} />
                    </Button>
                  </Tooltip>
                </EditProfileModal>
                <Tooltip label="Sign Out">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearUser}
                    className="h-8 w-8 rounded text-accent-gray hover:bg-white/[0.05] hover:text-accent-red"
                  >
                    <LogOut size={16} />
                  </Button>
                </Tooltip>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
