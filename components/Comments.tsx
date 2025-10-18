'use client';

import { cn } from '@/lib/utils';
import { useIsThreadActive } from '@liveblocks/react-lexical';
import { Composer, Thread } from '@liveblocks/react-ui';
import { useThreads } from '@liveblocks/react/suspense';
import Image from 'next/image';
import React from 'react';

const ThreadWrapper = ({ thread }: ThreadWrapperProps) => {
  const isActive = useIsThreadActive(thread.id);

  return (
    <Thread
      thread={thread}
      data-state={isActive ? 'active' : null}
      className={cn(
        'comment-thread border transition-all duration-200 rounded-lg p-3 bg-[#1c1f29]',
        isActive && '!border-blue-500 shadow-md',
        thread.resolved && 'opacity-40'
      )}
    />
  );
};

const Comments = () => {
  const { threads } = useThreads();

  const noThreads = threads.length === 0;

  return (
    <div className="comments-container flex flex-col gap-4 p-4 bg-[#14161f]/60 rounded-xl border border-gray-700">
      <Composer className="comment-composer" />

      {noThreads ? (
        <div className="flex flex-col items-center justify-center text-center py-10 text-gray-400">
          <img
            
          />
          <Image
            src="/assets/icons/silent.png"
            alt="No comments"
            width={56}
            height={56}
            className="opacity-70 mb-3"
          />
          <p className="text-lg font-medium">No comments yet</p>
          <p className="text-sm text-gray-500">Start a discussion using the composer above</p>
        </div>
      ) : (
        threads.map((thread) => <ThreadWrapper key={thread.id} thread={thread} />)
      )}
    </div>
  );
};

export default Comments;
