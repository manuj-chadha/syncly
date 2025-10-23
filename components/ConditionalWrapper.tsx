"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";

export default function ConditionalWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";

  if (isAuthPage) return <>{children}</>;

  return (
    <>
      <Header><></></Header>
      <main className={cn("pt-16")}>{children}</main>
    </>
  );
}
