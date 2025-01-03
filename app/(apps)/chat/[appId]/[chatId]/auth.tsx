"use client";

import { LayoutLoader } from "@/components/layout";
import { useChatInfo } from "@/lib/swr";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export function ChatAuth({ children }: { children: ReactNode }) {
  const { loading, error, chat } = useChatInfo();

  if (loading) {
    return <LayoutLoader />;
  }

  if ((error && error.status === 404) || !chat) {
    return notFound();
  }

  return children;
}
