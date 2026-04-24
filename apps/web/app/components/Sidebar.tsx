"use client";

import { useState } from "react";
import { Globe, Hash, Users, Plus, LogOut, ChevronDown, ChevronRight, Settings, MessageSquare } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useFriendStore } from "../store/useFriendStore";
import { useUserStore } from "../store/useUserStore";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";
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
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [dmsOpen, setDmsOpen] = useState(true);

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

  const activeDMParticipantId = activeSection === "dm" ? currentRoom?.participantId : undefined;

  return (
    <div className="w-64 bg-bg-sidebar flex flex-col shrink-0 relative overflow-hidden font-sans">
      {/* Background Subtle Glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-primary/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <button 
        onClick={() => globalRoom && selectRoom(globalRoom, "global")}
        className="h-16 flex items-center px-6 gap-3 shrink-0 hover:bg-white/[0.02] transition-all duration-300 group text-left w-full border-b border-white/[0.04]"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-lg shadow-primary/10 group-hover:scale-105 transition-transform">
          <MessageSquare size={16} className="text-white" />
        </div>
        <span className="font-bold text-white text-base tracking-tight">Meet</span>
      </button>

      <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1 custom-scrollbar">
        {/* Global */}
        {globalRoom && (
          <button
            onClick={() => selectRoom(globalRoom, "global")}
            className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 group relative ${
              activeSection === "global"
                ? "bg-primary/10 text-white before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-4 before:bg-primary before:rounded-r-full"
                : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
            }`}
          >
            <Globe size={16} className={`shrink-0 transition-colors ${activeSection === "global" ? "text-primary" : "text-gray-500 group-hover:text-gray-300"}`} />
            <span className="font-medium truncate">Global Discovery</span>
          </button>
        )}

        {/* Channels */}
        <div className="mt-6">
          <div className="flex items-center justify-between px-3 mb-2 group">
            <button
              onClick={() => setChannelsOpen((v) => !v)}
              className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.1em] hover:text-gray-300 transition-colors"
            >
              {channelsOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              Channels
            </button>
            <CreateChannelModal onCreate={onCreateChannel}>
              <button
                title="Create Channel"
                className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center text-gray-500 hover:text-primary transition-all rounded-lg hover:bg-primary/10"
              >
                <Plus size={14} />
              </button>
            </CreateChannelModal>
          </div>

          {channelsOpen && channels.length === 0 && (
            <p className="px-3 py-1 text-xs text-gray-600 italic font-light">No channels created</p>
          )}

          <div className="flex flex-col gap-0.5">
            {channelsOpen &&
              channels.map((room) => {
                const isActive = currentRoom?.chatId === room.chatId && activeSection === "channel";
                return (
                  <button
                    key={room.chatId}
                    onClick={() => selectRoom(room, "channel")}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 group relative ${
                      isActive
                        ? "bg-primary/10 text-white before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-4 before:bg-primary before:rounded-r-full"
                        : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-200"
                    }`}
                  >
                    <Hash size={16} className={`shrink-0 transition-colors ${isActive ? "text-primary" : "text-gray-600 group-hover:text-gray-400"}`} />
                    <span className={`truncate ${isActive ? "font-semibold" : "font-medium"}`}>{room.name}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Direct Messages */}
        <div className="mt-6">
          <div className="flex items-center justify-between px-3 mb-2">
            <button
              onClick={() => setDmsOpen((v) => !v)}
              className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.1em] hover:text-gray-300 transition-colors"
            >
              {dmsOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              Direct Messages
            </button>
          </div>

          {dmsOpen && friends.length === 0 && (
            <p className="px-3 py-1 text-xs text-gray-600 italic font-light">Start a conversation</p>
          )}

          <div className="flex flex-col gap-0.5">
            {dmsOpen &&
              friends.map((friend) => {
                const isActive = activeDMParticipantId === friend.id;
                return (
                  <button
                    key={friend.id}
                    onClick={() => handleFriendDM(friend.id, friend.name)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 group relative ${
                      isActive
                        ? "bg-primary/10 text-white before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-4 before:bg-primary before:rounded-r-full"
                        : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-200"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar name={friend.name} size="sm" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-[3px] border-bg-sidebar" />
                    </div>
                    <span className={`truncate ${isActive ? "text-white font-semibold" : "font-medium"}`}>
                      {friend.name}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Friends */}
        <button
          onClick={() => setActiveSection("friends")}
          className={`mt-6 w-full text-left flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 group relative ${
            activeSection === "friends"
              ? "bg-primary/10 text-white before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-4 before:bg-primary before:rounded-r-full"
              : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <Users size={16} className={`shrink-0 ${activeSection === "friends" ? "text-primary" : "text-gray-500 group-hover:text-gray-300"}`} />
            <span className="font-medium">Friends</span>
          </div>
          <Badge count={pendingIn.length} className="bg-primary/20 text-primary" />
        </button>
      </div>


      {/* User section */}
      <div className="px-4 py-4 shrink-0 bg-white/[0.02] backdrop-blur-md border-t border-white/[0.05]">
        {user && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <Avatar name={user.name} size="sm" className="ring-2 ring-primary/20" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-[3px] border-bg-sidebar shadow-sm" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-white text-[13px] font-bold truncate leading-tight">{user.name}</span>
                <span className="text-primary text-[10px] font-black uppercase tracking-widest leading-tight">Online</span>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <EditProfileModal>
                <Tooltip label="Settings">
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white">
                    <Settings size={14} />
                  </Button>
                </Tooltip>
              </EditProfileModal>
              <Tooltip label="Sign Out">
                <Button variant="ghost" size="icon" onClick={clearUser} className="w-8 h-8 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400">
                  <LogOut size={14} />
                </Button>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

