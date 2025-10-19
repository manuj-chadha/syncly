'use client';

import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense';
import { Editor } from '@/components/editor/Editor';
import Header from '@/components/Header';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import ActiveCollaborators from './ActiveCollaborators';
import { useEffect, useRef, useState } from 'react';
/* NOTE: removed the custom Input import to use native input so ref/scroll works reliably */
// import { Input } from './ui/input';
import Image from 'next/image';
import { updateDocument } from '@/lib/actions/room.actions';
import Loader from './Loader';
import ShareModal from './ShareModal';

const CollaborativeRoom = ({ roomId, roomMetadata, users, currentUserType }: CollaborativeRoomProps) => {
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setLoading(true);

      try {
        if (documentTitle !== roomMetadata.title) {
          const updatedDocument = await updateDocument(roomId, documentTitle);

          if (updatedDocument) {
            setEditing(false);
          }
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
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

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [roomId, documentTitle]);

  useEffect(() => {
    if (editing && inputRef.current) {
      // focus and move caret to end when entering edit mode
      const input = inputRef.current;
      input.focus({ preventScroll: true });
      const len = input.value.length;
      try {
        input.setSelectionRange(len, len);
      } catch {
        /* ignore if not supported */
      }
      // ensure scrolled to end
      requestAnimationFrame(() => {
        input.scrollLeft = input.scrollWidth;
      });
    }
  }, [editing]);

  // Auto-scroll and keep caret at the end while typing
  useEffect(() => {
    if (!editing || !inputRef.current) return;
    const input = inputRef.current;
    // set caret to end (keeps view on typed text)
    const len = input.value.length;
    try {
      input.setSelectionRange(len, len);
    } catch {
      /* ignore */
    }
    // scroll to the end
    requestAnimationFrame(() => {
      input.scrollLeft = input.scrollWidth;
    });
  }, [documentTitle, editing]);

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <div className="collaborative-room">
          <div className="flex flex-row items-start justify-between w-full mb-6">
            <div ref={containerRef} className="flex w-fit items-center justify-center gap-2">
              <div className="flex flex-col gap-2 4/5">
                <div className="flex gap-2 items-center">
                  {editing && !loading ? (
                    <input
                      type="text"
                      value={documentTitle}
                      ref={inputRef}
                      placeholder="Enter title"
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      onKeyDown={updateTitleHandler}
                      disabled={!editing}
                      // keep your visual classes intact + scrolling behavior
                      className="text-xl no-focus caret-visible sm:text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 w-3/5 bg-transparent overflow-x-auto whitespace-nowrap"
                      // ensure caret visible (explicit fallback)
                      style={{ direction: 'ltr', textAlign: 'left', caretColor: 'auto' }}
                    />
                  ) : (
                    <>
                      <p style={{ direction: 'ltr', textAlign: 'left', caretColor: 'auto' }} className="text-xl sm:text-2xl w-3/5 md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        {documentTitle}
                      </p>
                    </>
                  )}
                  {currentUserType === 'editor' && !editing && (
                    <Image
                      src="/assets/icons/edit.svg"
                      alt="edit"
                      width={24}
                      height={24}
                      onClick={() => setEditing(true)}
                      className="pointer text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
                    />
                  )}
                </div>
                <p
                  className={`mt-1 text-sm px-3 py-1 w-fit rounded-full inline-block ${
                    currentUserType === 'editor' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {currentUserType === 'editor' ? 'Editor Access' : 'Viewer Access'}
                </p>
              </div>

              {currentUserType !== 'editor' && !editing && <p className="view-only-tag">View only</p>}
            </div>

            <div className="flex flex-col items-end w-full flex-1 justify-end gap-2 sm:gap-3">
              <ShareModal roomId={roomId} collaborators={users} creatorId={roomMetadata.creatorId} currentUserType={currentUserType} />
              <ActiveCollaborators />
              {loading && <p className="text-sm text-gray-400">Saving...</p>}
            </div>
          </div>
          <Editor roomId={roomId} currentUserType={currentUserType} />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoom;
