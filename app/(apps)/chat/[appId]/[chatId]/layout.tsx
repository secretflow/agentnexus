import type { ReactNode } from "react";
import { ChatAuth } from "./auth";

export default function ChatLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ChatAuth>{children}</ChatAuth>;
}
