import AddDocumentBtn from '@/components/AddDocumentBtn'
import { DeleteModal } from '@/components/DeleteModal'
import Header from '@/components/Header'
import Notifications from '@/components/Notifications'
import { getDocuments } from '@/lib/actions/room.actions'
import { dateConverter } from '@/lib/utils'
import { SignedIn, UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Home() {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    redirect('/sign-in')
  }

  // Use safe optional chaining (avoids potential SSR nulls)
  const userEmail = clerkUser?.emailAddresses?.[0]?.emailAddress
  const roomDocuments = await getDocuments(userEmail)
  
  const documents = roomDocuments?.data || []

  return (
    <main className="min-h-screen w-full gradient bg-gradient-to-br from-[#0f1117] via-[#1d202e] to-[#262d46] bg-[length:200%_200%] animate-[gradientShift_60s_linear_infinite] text-white">
      {/* Header */}
      <Header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f1117]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Notifications />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>

      {/* Hero Section */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Your Documents. <br /> Ready. Organized. Yours.
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          Create, share, and collaborate in real-time — your workspace awaits.
        </p>
        <AddDocumentBtn
          userId={clerkUser.id}
          email={userEmail}
          className="bg-indigo-900 hover:bg-indigo-600 mx-auto text-white px-6 py-4 rounded-md shadow-lg transition-all"
        />
      </section>

      {/* Documents Section */}
      <section className="mx-auto w-full max-w-6xl px-6 py-10">
        {documents.length > 0 ? (
          <>
            <h2 className="text-3xl font-semibold text-white mb-6">
              Your Documents
            </h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {documents.map(({ id, metadata, createdAt }: any) => (
                <li
                  key={id}
                  className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#181b23]/70 p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/20"
                >
                  <Link
                    href={`/documents/${id}`}
                    className="flex flex-col gap-4 flex-1"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-md bg-[#1f2230] p-3 transition group-hover:bg-indigo-500/30">
                        <Image
                          src="/assets/icons/doc.svg"
                          alt="file"
                          width={36}
                          height={36}
                        />
                      </div>
                      <div>
                        <p className="line-clamp-1 text-lg font-medium text-white group-hover:text-indigo-400">
                          {metadata.title}
                        </p>
                        <p className="text-sm text-gray-400">
                          Created {dateConverter(createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 h-[1px] w-full bg-white/10"></div>
                  </Link>

                  <div className="mt-4 flex justify-end">
                    <DeleteModal roomId={id} />
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
            <div className="rounded-full bg-[#181b23]/60 p-6 animate-pulse">
              <Image
                src="/assets/icons/doc.svg"
                alt="Document"
                width={50}
                height={50}
                className="opacity-80"
              />
            </div>
            <h2 className="text-2xl font-semibold text-white">
              No documents yet
            </h2>
            <p className="text-gray-400 text-sm">
              Start your first document and collaborate instantly.
            </p>
            <AddDocumentBtn
              userId={clerkUser.id}
              email={userEmail}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-4 rounded-full shadow-lg transition-all"
            />
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 text-center">
        <h2 className="text-4xl font-bold text-indigo-400 mb-4">
          Take Collaboration to the Next Level
        </h2>
        <p className="text-gray-300 mb-8">
          Create more documents, invite collaborators, and see your ideas come to life.
        </p>
        <AddDocumentBtn
          userId={clerkUser.id}
          email={userEmail}
          className="bg-indigo-900 hover:bg-indigo-600 mx-auto text-white px-6 py-4 rounded-md shadow-lg transition-all"
        />
      </section>
    </main>
  )
}
