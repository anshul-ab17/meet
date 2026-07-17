"use client";

import { useState } from "react";
import { Globe, Hash, Users, Plus, LogOut, ChevronDown, ChevronRight, Settings, MessageSquare, Compass, Mic, Headphones } from "lucide-react";
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

  const handleHomeClick = () => {
    setActiveSection("friends");
  };

  const handleMeetServerClick = () => {
    setActiveSection("channel");
    if (channels.length > 0) {
      const isCurrentChannel = currentRoom && channels.some(c => c.chatId === currentRoom.chatId);
      if (!isCurrentChannel) {
        setCurrentRoom(channels[0] ?? null);
      }
    }
  };

  const handleGlobalDiscoveryClick = () => {
    if (globalRoom) {
      setCurrentRoom(globalRoom);
      setActiveSection("global");
    }
  };

  const activeDMParticipantId = activeSection === "dm" ? currentRoom?.participantId : undefined;

  return (
    <div className="flex h-full shrink-0 font-sans select-none">
      {/* 1. Leftmost Server Sidebar (72px) */}
      <div className="w-[72px] bg-bg-server flex flex-col items-center py-3 gap-2 shrink-0">
        {/* Home Button (Direct Messages / Friends) */}
        <Tooltip label="Direct Messages">
          <button
            onClick={handleHomeClick}
            className="relative group w-12 h-12 flex items-center justify-center transition-all duration-300"
          >
            <div className={`absolute left-0 w-1 bg-white rounded-r transition-all duration-300 ${
              activeSection === "friends" || activeSection === "dm"
                ? "h-10"
                : "h-0 group-hover:h-5"
            }`} />
            
            <div className={`w-12 h-12 flex items-center justify-center transition-all duration-300 ${
              activeSection === "friends" || activeSection === "dm"
                ? "rounded-[16px] bg-primary text-white"
                : "rounded-[24px] bg-bg-input text-accent-gray hover:rounded-[16px] hover:bg-primary hover:text-white"
            }`}>
              <MessageSquare size={22} />
            </div>
          </button>
        </Tooltip>

        {/* Separator */}
        <div className="w-8 h-[2px] bg-border-subtle rounded my-1" />

        {/* Meet Server Button */}
        <Tooltip label="Meet Server">
          <button
            onClick={handleMeetServerClick}
            className="relative group w-12 h-12 flex items-center justify-center transition-all duration-300"
          >
            <div className={`absolute left-0 w-1 bg-white rounded-r transition-all duration-300 ${
              activeSection === "channel"
                ? "h-10"
                : "h-0 group-hover:h-5"
            }`} />
            
            <div className={`w-12 h-12 flex items-center justify-center text-lg font-black transition-all duration-300 ${
              activeSection === "channel"
                ? "rounded-[16px] bg-primary text-white"
                : "rounded-[24px] bg-bg-input text-accent-gray hover:rounded-[16px] hover:bg-primary hover:text-white"
            }`}>
              M
            </div>
          </button>
        </Tooltip>

        {/* Global Discovery Button */}
        {globalRoom && (
          <Tooltip label="Global Discovery">
            <button
              onClick={handleGlobalDiscoveryClick}
              className="relative group w-12 h-12 flex items-center justify-center transition-all duration-300"
            >
              <div className={`absolute left-0 w-1 bg-white rounded-r transition-all duration-300 ${
                activeSection === "global"
                  ? "h-10"
                  : "h-0 group-hover:h-5"
              }`} />
              
              <div className={`w-12 h-12 flex items-center justify-center transition-all duration-300 ${
                activeSection === "global"
                  ? "rounded-[16px] bg-accent-green text-white"
                  : "rounded-[24px] bg-bg-input text-accent-gray hover:rounded-[16px] hover:bg-accent-green hover:text-white"
              }`}>
                <Compass size={22} />
              </div>
            </button>
          </Tooltip>
        )}

        {/* Add Channel Button (Dashed green button) */}
        <CreateChannelModal onCreate={onCreateChannel}>
          <Tooltip label="Add a Channel">
            <button
              className="relative group w-12 h-12 flex items-center justify-center transition-all duration-300 mt-1"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-[24px] bg-bg-input text-accent-green hover:rounded-[16px] hover:bg-accent-green hover:text-white transition-all duration-300">
                <Plus size={22} />
              </div>
            </button>
          </Tooltip>
        </CreateChannelModal>
      </div>

      {/* 2. Main Sidebar (240px) */}
      <div className="w-[240px] bg-bg-sidebar flex flex-col shrink-0 relative overflow-hidden">
        {/* Header */}
        {activeSection === "friends" || activeSection === "dm" ? (
          <div className="h-12 border-b border-black/[0.2] flex items-center px-3 shrink-0 shadow-sm">
            <button className="w-full text-left text-xs bg-bg-server text-accent-gray px-2 py-1.5 rounded truncate hover:text-accent-text transition-colors">
              Find or start a conversation
            </button>
          </div>
        ) : (
          <div className="h-12 border-b border-black/[0.2] flex items-center justify-between px-4 shrink-0 font-bold text-white shadow-sm hover:bg-white/[0.02] cursor-pointer transition-colors">
            <span className="truncate">Meet Server</span>
            <ChevronDown size={18} className="text-accent-gray" />
          </div>
        )}

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-0.5 custom-scrollbar">
          {activeSection === "friends" || activeSection === "dm" ? (
            // Home / Direct Messages view
            <>
              <button
                onClick={() => setActiveSection("friends")}
                className={`w-full text-left flex items-center justify-between gap-3 px-2 py-2 rounded text-sm transition-all duration-150 group ${
                  activeSection === "friends"
                    ? "bg-white/[0.08] text-white"
                    : "text-accent-gray hover:bg-white/[0.04] hover:text-accent-text"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users size={20} className={`shrink-0 ${activeSection === "friends" ? "text-white" : "text-accent-gray group-hover:text-accent-text"}`} />
                  <span className="font-semibold text-[14px]">Friends</span>
                </div>
                {pendingIn.length > 0 && (
                  <span className="bg-accent-red text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                    {pendingIn.length}
                  </span>
                )}
              </button>

              <div className="mt-4 flex items-center justify-between px-2 mb-1">
                <span className="text-[11px] font-bold text-accent-gray uppercase tracking-wider">
                  Direct Messages
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                {friends.map((friend) => {
                  const isActive = activeDMParticipantId === friend.id;
                  return (
                    <button
                      key={friend.id}
                      onClick={() => handleFriendDM(friend.id, friend.name)}
                      className={`w-full text-left flex items-center gap-3 px-2 py-1.5 rounded text-sm transition-all duration-150 group ${
                        isActive
                          ? "bg-white/[0.08] text-white font-semibold"
                          : "text-accent-gray hover:bg-white/[0.04] hover:text-accent-text font-medium"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <Avatar name={friend.name} size="sm" />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent-green rounded-full border-[3px] border-bg-sidebar" />
                      </div>
                      <span className="truncate">{friend.name}</span>
                    </button>
                  );
                })}
                {friends.length === 0 && (
                  <p className="px-2 py-1 text-xs text-accent-gray/60 italic font-light">Start a conversation</p>
                )}
              </div>
            </>
          ) : (
            // Channels View
            <>
              {/* Global Discovery Shortcut */}
              {globalRoom && (
                <button
                  onClick={() => selectRoom(globalRoom, "global")}
                  className={`w-full text-left flex items-center gap-2.5 px-2 py-2 rounded text-sm transition-all duration-150 group mb-4 ${
                    activeSection === "global"
                      ? "bg-white/[0.08] text-white"
                      : "text-accent-gray hover:bg-white/[0.04] hover:text-accent-text"
                  }`}
                >
                  <Globe size={20} className={`shrink-0 ${activeSection === "global" ? "text-white" : "text-accent-gray group-hover:text-accent-text"}`} />
                  <span className="font-semibold text-[14px]">Global Discovery</span>
                </button>
              )}

              <div className="flex items-center justify-between px-2 mb-1 group">
                <span className="text-[11px] font-black text-accent-gray uppercase tracking-wider flex items-center gap-0.5">
                  <ChevronDown size={12} className="text-accent-gray" />
                  Text Channels
                </span>
                <CreateChannelModal onCreate={onCreateChannel}>
                  <button
                    title="Create Channel"
                    className="text-accent-gray hover:text-white transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </CreateChannelModal>
              </div>

              <div className="flex flex-col gap-0.5">
                {channels.map((room) => {
                  const isActive = currentRoom?.chatId === room.chatId && activeSection === "channel";
                  return (
                    <button
                      key={room.chatId}
                      onClick={() => selectRoom(room, "channel")}
                      className={`w-full text-left flex items-center gap-1.5 px-2 py-1.5 rounded text-sm transition-all duration-150 group ${
                        isActive
                          ? "bg-white/[0.08] text-white font-semibold"
                          : "text-accent-gray hover:bg-white/[0.04] hover:text-accent-text font-medium"
                      }`}
                    >
                      <Hash size={20} className={`shrink-0 ${isActive ? "text-white" : "text-accent-gray group-hover:text-accent-text"}`} />
                      <span className="truncate lowercase">{room.name}</span>
                    </button>
                  );
                })}
                {channels.length === 0 && (
                  <p className="px-2 py-1 text-xs text-accent-gray/60 italic font-light">No channels created</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Discord user status footer */}
        <div className="h-[52px] px-2 bg-user-footer flex items-center justify-between shrink-0 border-t border-black/[0.15]">
          {user && (
            <div className="flex items-center justify-between w-full">
              <EditProfileModal>
                <div className="flex items-center gap-2 min-w-0 p-1 rounded hover:bg-white/[0.05] cursor-pointer flex-1">
                  <div className="relative shrink-0">
                    <Avatar name={user.name} size="sm" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent-green rounded-full border-[3px] border-user-footer" />
                  </div>
                  <div className="flex flex-col min-w-0 leading-none">
                    <span className="text-white text-xs font-semibold truncate">{user.name}</span>
                    <span className="text-accent-gray text-[10px] truncate mt-0.5">Online</span>
                  </div>
                </div>
              </EditProfileModal>

              <div className="flex items-center shrink-0">
                <Tooltip label="Mute">
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded text-accent-gray hover:text-white hover:bg-white/[0.05]">
                    <Mic size={16} />
                  </Button>
                </Tooltip>
                <Tooltip label="Deafen">
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded text-accent-gray hover:text-white hover:bg-white/[0.05]">
                    <Headphones size={16} />
                  </Button>
                </Tooltip>
                <EditProfileModal>
                  <Tooltip label="User Settings">
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded text-accent-gray hover:text-white hover:bg-white/[0.05]">
                      <Settings size={16} />
                    </Button>
                  </Tooltip>
                </EditProfileModal>
                <Tooltip label="Sign Out">
                  <Button variant="ghost" size="icon" onClick={clearUser} className="w-8 h-8 rounded text-accent-gray hover:text-accent-red hover:bg-white/[0.05]">
                    <LogOut size={16} />
                  </Button>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
