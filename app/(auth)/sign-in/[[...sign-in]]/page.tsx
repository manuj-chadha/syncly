import { SignIn } from '@clerk/nextjs'

const SignInPage = () => {
  return (
    <main className="auth-page">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#6366f1",
            fontSize: "15px",
          },
          elements: {
            card: "bg-[#0f0f17] border border-[#1c1c27] shadow-xl p-8 rounded-2xl text-[15px]",
            headerTitle: "text-white text-[22px] font-semibold",
            headerSubtitle: "text-gray-400 text-[14px]",
            formFieldInput: "bg-[#1a1a24] border border-[#2c2c39] text-white rounded-lg px-4 py-2 text-[13px]",
            formButtonPrimary: "bg-[#6366f1] text-white rounded-lg py-2 hover:bg-[#5558d8] text-[15px]",
            socialButtonsBlockButton:
              "bg-[#1a1a24] border border-[#2c2c39] text-white rounded-lg hover:bg-[#222230] text-[15px]",
            footer: "text-gray-500 text-[13px]"
          }
        }}
      />
    </main>
  )
}

export default SignInPage
