"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

export function ProfileDialog({ open, onOpenChange }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok && data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
          sessionStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Fetch user error:", err);
        setUser(null);
        sessionStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    if (open) fetchProfile();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : user ? (
          <div className="flex flex-col items-center space-y-4 py-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || ""} alt={user.name || "User"} />
              <AvatarFallback className="text-lg">
                {user.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">{user.name || "Unknown"}</h3>
              <p className="text-muted-foreground text-sm">{user.email || "No Email"}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">User not found or not logged in.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
