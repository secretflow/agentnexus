import { Background } from "@/components/layout";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Background />
      <div className="relative z-10 flex min-h-screen w-screen justify-center">{children}</div>
    </>
  );
}
