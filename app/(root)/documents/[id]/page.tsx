export const dynamic = "force-dynamic";

import CollaborativeRoom from "@/components/CollaborativeRoom";
import Header from "@/components/Header";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Document = async (props: SearchParamProps) => {
  const { params } = props;
  const id = params.id;

  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const email = clerkUser.emailAddresses[0].emailAddress;

  const room = await getDocument({ roomId: id, userId: email });
  if (!room) redirect("/");

  const userIds = Object.keys(room.usersAccesses || {});
  const users = userIds.length ? await getClerkUsers({ userIds }) : [];

  const hasWriteAccess = (email: string) =>
    room.usersAccesses[email]?.includes("room:write");

  // ✅ 1. Filter out invalid users (null / missing email)
  const usersData = users
    .filter((user: User | null): user is User => !!user?.email)
    .map((user: User) => ({
      ...user,
      userType: hasWriteAccess(user.email) ? "editor" : "viewer",
    }));

  // ✅ 2. Handle “invited but not registered” users
  const invitedEmails = Object.keys(room.usersAccesses || {});
  const ghostUsers = invitedEmails
    .filter((email) => !usersData.some((u: User) => u.email === email))
    .map((email) => ({
      id: email,
      email,
      fullName: email.split("@")[0],
      avatar: null,
      userType: hasWriteAccess(email) ? "editor" : "viewer",
      isInvited: true,
    }));

  // ✅ 3. Combine both
  const allUsersData = [...usersData, ...ghostUsers];

  // ✅ 4. Determine current user type
  const currentUserType = hasWriteAccess(email) ? "editor" : "viewer";

  return (
    <>
      <Header>
        <></>
      </Header>

      <main
        className="min-h-screen w-full pt-16 flex flex-col items-center 
                   bg-gradient-to-br from-[#0f1117] via-[#14161f] to-[#2a2f41]
                   bg-[length:200%_200%] animate-[gradientShift_60s_linear_infinite]
                   text-white"
      >
        <section className="w-full max-w-7xl p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                {room.metadata?.title || "Untitled Document"}
              </h1>
              <p
                className={`mt-1 text-sm px-3 py-1 rounded-full inline-block ${
                  currentUserType === "editor"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {currentUserType === "editor"
                  ? "Editor Access"
                  : "Viewer Access"}
              </p>
            </div>
          </div>

          {/* Collaborative editor component */}
          <CollaborativeRoom
            roomId={id}
            roomMetadata={room.metadata}
            users={allUsersData}
            currentUserType={currentUserType}
          />
        </section>
      </main>
    </>
  );
};

export default Document;
