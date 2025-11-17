import Header from "@/components/Header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-page-wrapper">
      <Header><></></Header>
      <main className="mt-16">
      {children}
      </main>
    </main>
  )
}
