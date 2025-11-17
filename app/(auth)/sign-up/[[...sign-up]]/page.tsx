import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0b0b12] to-[#11111a]">
      <SignUp
        appearance={{
          variables: {
            fontSize: "15px",
            colorPrimary: "#6366f1"
          },
          elements: {
            card:
              "bg-[#0f0f17] border border-[#1c1c27] shadow-xl p-8 rounded-2xl text-[14px]",
            headerTitle: "text-white text-[22px] font-semibold",
            headerSubtitle: "text-gray-400 text-[14px]",
            formFieldInput:
              "bg-[#1a1a24] border border-[#2c2c39] text-white rounded-lg p-2 text-[13px]",
            formButtonPrimary:
              "bg-[#6366f1] text-white rounded-lg py-2 hover:bg-[#5558d8] text-[14px]",
            socialButtonsBlockButton:
              "bg-[#1a1a24] border border-[#2c2c39] text-white rounded-lg hover:bg-[#222230] text-[15px]",
            footer: "text-gray-500 text-[13px]"
          }
        }}
      />
    </main>
  );
}
