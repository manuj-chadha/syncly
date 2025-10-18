'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Input } from './ui/input';
import { updateDocument } from '@/lib/actions/room.actions';
import ActiveCollaborators from './ActiveCollaborators';
import ShareModal from './ShareModal';
import Loader from './Loader';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

const SubHeader = ({ roomId, roomMetadata, users, currentUserType }: CollaborativeRoomProps) => {
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setLoading(true);
      try {
        if (documentTitle !== roomMetadata.title) {
          await updateDocument(roomId, documentTitle);
        }
        setEditing(false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setEditing(false);
        updateDocument(roomId, documentTitle);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [roomId, documentTitle]);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full bg-[#14161f]/60 backdrop-blur-md border-b border-gray-700 p-4 rounded-xl mt-4">
      <div ref={containerRef} className="flex items-center gap-2">
        {editing && !loading ? (
          <Input
            type="text"
            ref={inputRef}
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            onKeyDown={updateTitleHandler}
            className="bg-transparent border-none text-xl font-semibold text-white focus:ring-0 focus:outline-none"
          />
        ) : (
          <p
            className="text-xl font-semibold text-white cursor-pointer"
            onClick={() => currentUserType === 'editor' && setEditing(true)}
          >
            {documentTitle}
          </p>
        )}

        {loading && <p className="text-sm text-gray-400 ml-2">Saving...</p>}
      </div>

      <div className="flex items-center gap-3">
        <ActiveCollaborators />

        <ShareModal
          roomId={roomId}
          collaborators={users}
          creatorId={roomMetadata.creatorId}
          currentUserType={currentUserType}
        />

        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default SubHeader;
