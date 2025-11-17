'use client';

import Image from "next/image";
import React, { useState } from "react";
import UserTypeSelector from "./UserTypeSelector";
import { Button } from "./ui/button";
import {
  removeCollaborator,
  updateDocumentAccess,
} from "@/lib/actions/room.actions";

type CollaboratorProps = {
  roomId: string;
  creatorId: string;
  collaborator: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
    userType?: UserType;
  };
  email: string;
  user: any;
};

export default function Collaborator({
  roomId,
  creatorId,
  collaborator,
  email,
  user,
}: CollaboratorProps) {
  const [userType, setUserType] = useState<UserType>(
    (collaborator.userType as UserType) || "viewer"
  );
  const [loading, setLoading] = useState(false);

  const updateAccess = async (type: string) => {
    setLoading(true);
    try {
      await updateDocumentAccess({
        roomId,
        email,
        userType: type as UserType,
        updatedBy: user,
      });
    } finally {
      setLoading(false);
    }
  };

  const removeAccess = async () => {
    setLoading(true);
    try {
      await removeCollaborator({ roomId, email });
    } finally {
      setLoading(false);
    }
  };

  // OWNER (Creator)
  if (creatorId === collaborator?.id) {
    return (
      <p className="text-sm text-blue-100 font-medium">Owner</p>
    );
  }

  return (
    <div className="flex flex-row sm:flex-row items-center gap-2">
      <UserTypeSelector
        userType={userType}
        setUserType={setUserType}
        onClickHandler={updateAccess}
      />

      <Button
        type="button"
        variant="destructive"
        disabled={loading}
        onClick={removeAccess}
        className="h-9 px-4"
      >
        Remove
      </Button>
    </div>
  );
}
