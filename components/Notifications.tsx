import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { currentUser } from "@clerk/nextjs/server";
import { InboxNotification, InboxNotificationList, LiveblocksUIConfig } from "@liveblocks/react-ui";
import Image from "next/image";
import { ClientNotifications } from "./ClientNotifications";

export default async function Notifications() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // You CANNOT use Liveblocks hooks in a server component,
  // so instead: move the inbox rendering to a separate <ClientNotifications /> component
  return (
    <ClientNotifications />
  );
}
