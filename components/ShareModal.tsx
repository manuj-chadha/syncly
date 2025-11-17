'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import Image from "next/image";

import { useSelf } from "@liveblocks/react/suspense";
import { useState } from "react";

import UserTypeSelector from "./UserTypeSelector";
import Collaborator from "./Collaborator";
import { updateDocumentAccess } from "@/lib/actions/room.actions";

export default function ShareModal({
  roomId,
  collaborators,
  creatorId,
  currentUserType,
}: ShareDocumentDialogProps) {
  const user = useSelf();

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>("viewer");

  const submitInvite = async () => {
    if (!email.trim()) return;

    setLoading(true);
    try {
      await updateDocumentAccess({
        roomId,
        email,
        userType,
        updatedBy: user.info,
      });

      setEmail("");
      setUserType("viewer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="gradient-blue h-9 gap-1 px-4 flex"
          disabled={currentUserType !== "editor"}
        >
          <Image
            src="/assets/icons/share.svg"
            alt="share"
            width={20}
            height={20}
          />
          <span className="hidden sm:block">Share</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          bg-[#0f1117] text-white
          rounded-xl shadow-2xl border border-[#1c1c27]
          w-[95%] max-w-md p-5
          backdrop-blur-md
          animate-in fade-in zoom-in-90
        "
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Manage who can view this project
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            Select which users can view and edit this document.
          </DialogDescription>
        </DialogHeader>

        {/* Email Input */}
        <div className="mt-4 space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-blue-200">
            Email address
          </Label>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-1 bg-[#1b1d25] border border-[#2c2e38] rounded-md items-center">
              <Input
                id="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none text-white px-3 py-2"
              />

              <UserTypeSelector
                userType={userType}
                setUserType={setUserType}
              />
            </div>

            <Button
              onClick={submitInvite}
              disabled={loading}
              className="gradient-blue h-9 px-6"
            >
              {loading ? "Sending..." : "Invite"}
            </Button>
          </div>
        </div>

        {/* Collaborator List */}
        <div className="mt-6 space-y-1">
          {collaborators.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-4">
              No collaborators yet.
            </p>
          ) : (
            collaborators.map((c) => (
              <div
                key={c.id}
                className="
                  flex flex-col sm:flex-row
                  justify-between items-start sm:items-center
                  gap-2 py-3 border-b border-white/10
                "
              >
                {/* left: avatar, name, email */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {c.avatar ? (
                    <Image
                      src={c.avatar}
                      alt="avatar"
                      width={36}
                      height={36}
                      className="rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-700 text-white text-sm">
                      {c.name?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {c.name || c.email.slice(0, c.email.length-10)}
                      {(c as any).isInvited && (
                        <span className="text-xs text-gray-400 ml-1">
                          (Invited)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{c.email}</p>
                  </div>
                </div>

                {/* right: role + remove */}
                <div className="flex sm:flex-row flex-col gap-2 sm:gap-3 sm:ml-4">
                  <Collaborator
                    roomId={roomId}
                    creatorId={creatorId}
                    collaborator={c}
                    email={c.email}
                    user={user.info}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
