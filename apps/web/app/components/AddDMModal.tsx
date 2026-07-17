"use client";

import { type FormEvent, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import type { Room } from "../types";

import { graphqlRequest } from "../lib/graphql";

interface AddDMModalProps {
  children: React.ReactNode;
  onOpen: (targetUserId: string, targetUserName?: string) => Promise<Room | null>;
}

export function AddDMModal({ children, onOpen }: AddDMModalProps) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setError("");
    setLoading(true);
    try {
      const data = await graphqlRequest(`
        query UserByName($name: String!) {
          userByName(name: $name) {
            id
            name
          }
        }
      `, { name: username.trim() });

      const targetUser = data.userByName;
      if (!targetUser) {
        setError("User not found");
        return;
      }
      const result = await onOpen(targetUser.id, targetUser.name);
      if (result) {
        setUsername("");
        setOpen(false);
      } else {
        setError("Could not open DM");
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent title="New Direct Message">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            placeholder="Search by username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" disabled={loading || !username.trim()} className="w-full">
            {loading ? "Opening..." : "Open DM"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
