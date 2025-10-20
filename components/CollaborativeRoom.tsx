'use client';

import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense';
import { Editor } from '@/components/editor/Editor';
import ActiveCollaborators from './ActiveCollaborators';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { updateDocument } from '@/lib/actions/room.actions';
import Loader from './Loader';
import ShareModal from './ShareModal';

const MAX_TITLE_LENGTH = 60;

const CollaborativeRoom = ({ roomId, roomMetadata, users, currentUserType }: CollaborativeRoomProps) => {
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title || '');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Save handler (used on Enter and outside click)
  const saveTitle = async (titleToSave?: string) => {
    const title = typeof titleToSave === 'string' ? titleToSave : documentTitle;
    setLoading(true);
    try {
      if (title !== roomMetadata.title) {
        await updateDocument(roomId, title);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setEditing(false);
    }
  };

  // Auto-resize helper
  const syncTextareaHeight = (el?: HTMLTextAreaElement | null) => {
    const t = el ?? textareaRef.current;
    if (!t) return;
    t.style.height = 'auto'; // reset
    // Add a tiny offset to avoid 1px cropping on some browsers
    t.style.height = `${t.scrollHeight + 2}px`;
  };

  // Ensure textarea height syncs when title changes
  useLayoutEffect(() => {
    syncTextareaHeight();
  }, [documentTitle, editing]);

  // Focus + put caret at end when entering edit mode
  useEffect(() => {
    if (editing && textareaRef.current) {
      const t = textareaRef.current;
      t.focus({ preventScroll: true });
      // set caret to end
      const len = t.value.length;
      try {
        t.setSelectionRange(len, len);
      } catch {
        // ignore
      }
      // ensure scrolled to bottom
      requestAnimationFrame(() => syncTextareaHeight(t));
    }
  }, [editing]);

  // outside click -> save
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (editing) {
          const val = textareaRef.current ? textareaRef.current.value : documentTitle;
          setDocumentTitle(val);
          saveTitle(val);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    // intentionally not depending on documentTitle to avoid extra re-registers
  }, [roomId, editing]); // note: documentTitle not in deps

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <div className="collaborative-room">
          <div className="flex flex-row items-start justify-between w-full mb-6">
            <div ref={containerRef} className="flex items-start gap-2 w-full">
              <div className="flex flex-col gap-2 w-[80%]">
                <div className="flex gap-2 items-start w-full">
                  {editing && !loading ? (
                    /* EDIT MODE: stacked layers - gradient mirror underneath + visible textarea caret on top */
                    <div className="relative w-full">
                      {/* Gradient mirror layer */}
                      <div
                        aria-hidden
                        className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words text-xl sm:text-2xl md:text-4xl font-bold
                                   bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                        style={{ wordBreak: 'break-word' }}
                      >
                        {(textareaRef.current?.value ?? documentTitle) || 'Untitled'}
                      </div>

                      {/* Actual input layer */}
                      <textarea
                        ref={textareaRef}
                        value={documentTitle}
                        maxLength={MAX_TITLE_LENGTH}
                        onChange={(e) => {
                          // enforce max length defensively
                          const v = e.target.value.slice(0, MAX_TITLE_LENGTH);
                          setDocumentTitle(v);
                        }}
                        onInput={(e) => {
                          syncTextareaHeight(e.currentTarget);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault(); // avoid newline
                            saveTitle(e.currentTarget.value);
                          } else if (e.key === 'Escape') {
                            // cancel edit, revert to last saved
                            setEditing(false);
                            setDocumentTitle(roomMetadata.title);
                          }
                        }}
                        className="relative w-full text-xl sm:text-2xl md:text-4xl font-bold bg-transparent text-transparent caret-indigo-400
                                   outline-none resize-none overflow-hidden scrollbar-none whitespace-pre-wrap break-words"
                        rows={1}
                        style={{
                          // allow visible caret while making text transparent (mirror shows gradient)
                          WebkitTextFillColor: 'transparent',
                          // MozTextFillColor: 'transparent' as any,
                          // small padding to align mirror and textarea
                          padding: 0,
                          margin: 0,
                          lineHeight: 1.1,
                        }}
                      />
                      {/* small counter under the title while editing */}
                      <div className="mt-1">
                        <span className={`text-xs ${documentTitle.length === MAX_TITLE_LENGTH ? 'text-red-400' : 'text-gray-400'}`}>
                          {documentTitle.length}/{MAX_TITLE_LENGTH}
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* DISPLAY MODE: gradient text (normal p) */
                    <p className="text-xl sm:text-2xl w-fit max-w-full md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 break-words">
                      {documentTitle || 'Untitled'}
                    </p>
                  )}

                  {currentUserType === 'editor' && !editing && (
                    <Image
                      src="/assets/icons/edit.svg"
                      alt="edit"
                      width={24}
                      height={24}
                      onClick={() => setEditing(true)}
                      className="cursor-pointer ml-2 mt-1"
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
