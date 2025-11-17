export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-page-wrapper">
      {children}
    </main>
  )
}
