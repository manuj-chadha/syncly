'use client';

import {
  InboxNotification,
  InboxNotificationList,
  LiveblocksUIConfig,
} from "@liveblocks/react-ui";
import { useInboxNotifications, useUnreadInboxNotificationsCount } from "@liveblocks/react/suspense";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Image from "next/image";
import { ReactNode } from "react";

export function ClientNotifications() {
  const { inboxNotifications } = useInboxNotifications();
  const { count } = useUnreadInboxNotificationsCount();
  const unread = inboxNotifications.filter((n) => !n.readAt);

  return (
    <Popover>
      <PopoverTrigger className="relative flex size-10 items-center justify-center rounded-lg">
        <Image src="/assets/icons/bell.svg" alt="inbox" width={24} height={24} />
        {count > 0 && <div className="absolute right-2 top-2 z-20 size-2 rounded-full bg-blue-500" />}
      </PopoverTrigger>
      <PopoverContent align="end" className="shad-popover text-sm sm:text-md">
        <LiveblocksUIConfig overrides={{
          INBOX_NOTIFICATION_TEXT_MENTION: (user: ReactNode) => <>{user} mentioned you.</>,
        }}>
          <InboxNotificationList>
            {unread.length === 0 && (
              <p className="py-2 text-center text-dark-500">No new notifications</p>
            )}
            {unread.map((n) => (
              <InboxNotification
                key={n.id}
                inboxNotification={n}
                href={`/documents/${n.roomId}`}
                showActions={false}
              />
            ))}
          </InboxNotificationList>
        </LiveblocksUIConfig>
      </PopoverContent>
    </Popover>
  );
}
