'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useSelf } from '@liveblocks/react/suspense';
import React, { useState } from 'react';
import { Button } from "./ui/button";
import Image from "next/image";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import UserTypeSelector from "./UserTypeSelector";
import Collaborator from "./Collaborator";
import { updateDocumentAccess } from "@/lib/actions/room.actions";

const ShareModal = ({ roomId, collaborators, creatorId, currentUserType }: ShareDocumentDialogProps) => {
  const user = useSelf();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<UserType>('viewer');

  const shareDocumentHandler = async () => {
    if (!email.trim()) return;

    setLoading(true);
    try {
      await updateDocumentAccess({
        roomId,
        email,
        userType: userType as UserType,
        updatedBy: user.info,
      });
      setEmail('');
      setUserType('viewer');
    } catch (err) {
      console.error('Error inviting user:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          className="gradient-blue flex h-9 gap-1 px-4"
          disabled={currentUserType !== 'editor'}
        >
          <Image
            src="/assets/icons/share.svg"
            alt="share"
            width={20}
            height={20}
            className="min-w-4 md:size-5"
          />
          <p className="mr-1 hidden sm:block">Share</p>
        </Button>
      </DialogTrigger>

      <DialogContent className="shad-dialog">
        <DialogHeader>
          <DialogTitle>Manage who can view this project</DialogTitle>
          <DialogDescription>
            Select which users can view and edit this document
          </DialogDescription>
        </DialogHeader>

        <Label htmlFor="email" className="mt-6 text-blue-100">
          Email address
        </Label>

        <div className="flex items-center gap-3">
          <div className="flex flex-1 rounded-md bg-dark-400">
            <Input
              id="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="share-input"
            />
            <UserTypeSelector userType={userType} setUserType={setUserType} />
          </div>
          <Button
            type="submit"
            onClick={shareDocumentHandler}
            className="gradient-blue flex h-full gap-1 px-5"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Invite'}
          </Button>
        </div>

        {/* Collaborator List */}
        <div className="my-2 space-y-2">
          {collaborators.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-4">
              No collaborators yet.
            </div>
          ) : (
            <ul className="flex flex-col">
              {collaborators.map((collaborator) => (
                <li key={collaborator.id} className="flex items-center gap-3 py-2 border-b border-gray-700 last:border-none">
                  {/* Safe Image Rendering */}
                  {collaborator.avatar ? (
                    <Image
                      src={collaborator.avatar}
                      alt={collaborator.name || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-white text-xs">
                      {collaborator.name?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {collaborator.name || collaborator.email}
                      {(collaborator as any).isInvited && (
                        <span className="ml-1 text-xs text-gray-400">
                          (Invited)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">{collaborator.email}</p>
                  </div>

                  <Collaborator
                    roomId={roomId}
                    creatorId={creatorId}
                    email={collaborator.email}
                    collaborator={collaborator}
                    user={user.info}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
