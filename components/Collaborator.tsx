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

const Collaborator = ({
  roomId,
  creatorId,
  collaborator,
  email,
  user,
}: CollaboratorProps) => {
  const [userType, setUserType] = useState<UserType>(
    (collaborator.userType as UserType) || "viewer"
  );
  const [loading, setLoading] = useState(false);

  const shareDocumentHandler = async (type: string) => {
    try {
      setLoading(true);
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

  const removeCollaboratorHandler = async (email: string) => {
    try {
      setLoading(true);
      await removeCollaborator({ roomId, email });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Safe fallbacks
  const avatarSrc = collaborator?.avatar || "/default-avatar.png";
  const displayName = collaborator?.name || "Guest User";
  const displayEmail = collaborator?.email || "No email linked";

  return (
    <li className="flex items-center justify-between gap-2 py-3">
      {/* <div className="flex gap-2 items-center">
        <Image
          src={avatarSrc}
          alt={displayName}
          width={36}
          height={36}
          className="size-9 rounded-full object-cover"
        />
        <div>
          <p className="line-clamp-1 text-sm font-semibold leading-4 text-white">
            {displayName}
            <span className="text-10-regular pl-2 text-blue-100">
              {loading && "updating..."}
            </span>
          </p>
          <p className="text-sm font-light text-blue-100">{displayEmail}</p>
        </div>
      </div> */}

      {creatorId === collaborator?.id ? (
        <p className="text-sm text-blue-100">Owner</p>
      ) : (
        <div className="flex items-center gap-2">
          <UserTypeSelector
            userType={userType as UserType}
            setUserType={setUserType}
            onClickHandler={shareDocumentHandler}
          />
          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={() => removeCollaboratorHandler(displayEmail)}
          >
            Remove
          </Button>
        </div>
      )}
    </li>
  );
};

export default Collaborator;
