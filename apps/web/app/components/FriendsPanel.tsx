"use client";

import { type FormEvent, useState } from "react";
import { UserPlus, MessageSquare, X, Check, Users } from "lucide-react";
import { useFriendStore } from "../store/useFriendStore";
import { useChatStore } from "../store/useChatStore";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { Tooltip } from "./ui/tooltip";
import type { Friend, Room } from "../types";
import { graphqlRequest } from "../lib/graphql";

type Tab = "all" | "pending" | "add";

interface FriendsPanelProps {
  token: string;
  onOpenDM: (targetUserId: string) => Promise<Room | null>;
  onRefresh: () => void;
}

export function FriendsPanel({ token, onOpenDM, onRefresh }: FriendsPanelProps) {
  const [tab, setTab] = useState<Tab>("all");
  const [addName, setAddName] = useState("");
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const { friends, pendingIn, pendingOut, removeFriend, removePendingIn, removePendingOut, addFriend } =
    useFriendStore();
  const setActiveSection = useChatStore((s) => s.setActiveSection);

  const handleOpenDM = async (friend: Friend) => {
    const room = await onOpenDM(friend.id);
    if (room) setActiveSection("dm");
  };

  const handleAccept = async (requesterId: string) => {
    try {
      await graphqlRequest(`
        mutation Accept($requesterId: ID!) {
          acceptFriendRequest(requesterId: $requesterId)
        }
      `, { requesterId }, token);
      const accepted = pendingIn.find((f) => f.id === requesterId);
      if (accepted) {
        addFriend(accepted);
        removePendingIn(requesterId);
      }
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (requesterId: string) => {
    try {
      await graphqlRequest(`
        mutation Reject($requesterId: ID!) {
          rejectFriendRequest(requesterId: $requesterId)
        }
      `, { requesterId }, token);
      removePendingIn(requesterId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelRequest = async (targetId: string) => {
    try {
      await graphqlRequest(`
        mutation Cancel($targetId: ID!) {
          cancelFriendRequest(targetUserId: $targetId)
        }
      `, { targetId }, token);
      removePendingOut(targetId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await graphqlRequest(`
        mutation RemoveFriend($friendId: ID!) {
          removeFriend(friendId: $friendId)
        }
      `, { friendId }, token);
      removeFriend(friendId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddFriend = async (e: FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;
    setAddError("");
    setAddSuccess("");
    setAddLoading(true);
    try {
      const queryData = await graphqlRequest(`
        query UserByName($name: String!) {
          userByName(name: $name) {
            id
            name
          }
        }
      `, { name: addName.trim() }, token);

      const targetUser = queryData.userByName;
      if (!targetUser) {
        setAddError("User not found");
        return;
      }

      await graphqlRequest(`
        mutation SendRequest($targetUserId: ID!) {
          sendFriendRequest(targetUserId: $targetUserId)
        }
      `, { targetUserId: targetUser.id }, token);

      setAddSuccess(`Success! Your friend request to ${addName.trim()} was sent.`);
      setAddName("");
      onRefresh();
    } catch (err: any) {
      setAddError(err.message ?? "Failed to send request");
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-bg-base select-none">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-black/[0.2] shrink-0 shadow-sm bg-bg-base">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-accent-gray">
            <Users size={20} className="shrink-0" />
            <span className="font-bold text-white text-[15px]">Friends</span>
          </div>

          <div className="w-[1px] h-4 bg-border-subtle" />

          <div className="flex gap-2">
            <button
              onClick={() => setTab("all")}
              className={`px-2 py-1 rounded text-sm font-semibold transition-colors ${
                tab === "all" ? "bg-white/[0.08] text-white" : "text-accent-gray hover:bg-white/[0.04] hover:text-accent-text"
              }`}
            >
              All Friends ({friends.length})
            </button>

            <button
              onClick={() => setTab("pending")}
              className={`px-2 py-1 rounded text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                tab === "pending" ? "bg-white/[0.08] text-white" : "text-accent-gray hover:bg-white/[0.04] hover:text-accent-text"
              }`}
            >
              Pending
              {pendingIn.length > 0 && (
                <span className="bg-accent-red text-white text-[10px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center">
                  {pendingIn.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setTab("add")}
              className={`px-2 py-1 rounded text-sm font-semibold transition-colors ${
                tab === "add" 
                  ? "bg-accent-green/20 text-accent-green font-bold" 
                  : "text-accent-green bg-accent-green/10 hover:bg-accent-green/20"
              }`}
            >
              Add Friend
            </button>
          </div>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
        {/* All Friends List */}
        {tab === "all" && (
          <div className="flex flex-col max-w-4xl">
            <h2 className="text-[12px] font-bold text-accent-gray uppercase tracking-wider mb-4">
              All Friends — {friends.length}
            </h2>
            
            {friends.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-accent-gray text-sm">Your list is waiting for friends. Add some!</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between py-2 px-3 hover:bg-white/[0.04] rounded-md transition-colors group border-t border-white/[0.03] first:border-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar name={friend.name} size="md" />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent-green rounded-full border-[3px] border-bg-base" />
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="text-white text-sm font-semibold group-hover:text-white transition-colors">{friend.name}</span>
                        <span className="text-[12px] text-accent-gray font-medium">Online</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Tooltip label="Message">
                        <button 
                          onClick={() => handleOpenDM(friend)}
                          className="w-9 h-9 rounded-full bg-bg-input text-accent-gray hover:text-white hover:bg-black/40 flex items-center justify-center transition-colors"
                        >
                          <MessageSquare size={18} />
                        </button>
                      </Tooltip>
                      <Tooltip label="Remove Friend">
                        <button 
                          onClick={() => handleRemoveFriend(friend.id)}
                          className="w-9 h-9 rounded-full bg-bg-input text-accent-gray hover:text-accent-red hover:bg-black/40 flex items-center justify-center transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pending Requests */}
        {tab === "pending" && (
          <div className="flex flex-col max-w-4xl gap-6">
            {pendingIn.length > 0 && (
              <div>
                <h2 className="text-[12px] font-bold text-accent-gray uppercase tracking-wider mb-2">
                  Incoming — {pendingIn.length}
                </h2>
                <div className="flex flex-col">
                  {pendingIn.map((req) => (
                    <div 
                      key={req.id} 
                      className="flex items-center justify-between py-2 px-3 hover:bg-white/[0.04] rounded-md transition-colors border-t border-white/[0.03]"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={req.name} size="md" />
                        <div className="flex flex-col leading-tight">
                          <span className="text-white text-sm font-semibold">{req.name}</span>
                          <span className="text-[12px] text-accent-gray font-medium">Incoming Friend Request</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Tooltip label="Accept">
                          <button 
                            onClick={() => handleAccept(req.id)}
                            className="w-9 h-9 rounded-full bg-[#248046] hover:bg-[#1a6535] text-white flex items-center justify-center transition-colors"
                          >
                            <Check size={18} />
                          </button>
                        </Tooltip>
                        <Tooltip label="Ignore">
                          <button 
                            onClick={() => handleReject(req.id)}
                            className="w-9 h-9 rounded-full bg-bg-input text-accent-gray hover:text-accent-red hover:bg-black/40 flex items-center justify-center transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pendingOut.length > 0 && (
              <div>
                <h2 className="text-[12px] font-bold text-accent-gray uppercase tracking-wider mb-2">
                  Outgoing — {pendingOut.length}
                </h2>
                <div className="flex flex-col">
                  {pendingOut.map((req) => (
                    <div 
                      key={req.id} 
                      className="flex items-center justify-between py-2 px-3 hover:bg-white/[0.04] rounded-md transition-colors border-t border-white/[0.03]"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={req.name} size="md" />
                        <div className="flex flex-col leading-tight">
                          <span className="text-white text-sm font-semibold">{req.name}</span>
                          <span className="text-[12px] text-accent-gray font-medium">Outgoing Friend Request</span>
                        </div>
                      </div>
                      <Tooltip label="Cancel Request">
                        <button 
                          onClick={() => handleCancelRequest(req.id)}
                          className="w-9 h-9 rounded-full bg-bg-input text-accent-gray hover:text-accent-red hover:bg-black/40 flex items-center justify-center transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </Tooltip>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pendingIn.length === 0 && pendingOut.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-accent-gray text-sm">No pending friend requests.</p>
              </div>
            )}
          </div>
        )}

        {/* Add Friend Form */}
        {tab === "add" && (
          <div className="max-w-2xl flex flex-col">
            <h2 className="text-[14px] font-bold text-white uppercase tracking-tight mb-1">
              Add Friend
            </h2>
            <p className="text-accent-gray text-xs mb-4">
              You can add friends with their Meet username.
            </p>
            
            <form onSubmit={handleAddFriend} className="flex bg-[#1e1f22] border border-black/30 rounded-lg p-3 w-full focus-within:border-accent-blurple transition-colors relative">
              <input
                placeholder="You can add friends with their Meet username"
                className="bg-transparent text-white text-[15px] outline-none placeholder:text-accent-gray/40 w-full pr-24 font-normal"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                autoFocus
              />
              <button 
                type="submit"
                disabled={addLoading || !addName.trim()}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-accent-blurple hover:bg-[#4752c4] disabled:bg-[#3c4270]/70 disabled:text-[#ffffff]/30 text-white px-4 py-1.5 rounded text-sm font-semibold transition-colors shrink-0 flex items-center gap-1.5"
              >
                <UserPlus size={14} />
                Send Friend Request
              </button>
            </form>
            
            {addError && <p className="text-accent-red text-sm mt-3 font-medium">{addError}</p>}
            {addSuccess && <p className="text-accent-green text-sm mt-3 font-medium">{addSuccess}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
