"use client";

import { KnowledgebaseNotFound } from "@/components/knowledgebase";
import { LayoutLoader } from "@/components/layout";
import { useKnowledgebase } from "@/lib/swr";
import type { ReactNode } from "react";

export function KnowledgebaseAuth({ children }: { children: ReactNode }) {
  const { loading, error } = useKnowledgebase();

  if (loading) {
    return <LayoutLoader />;
  }

  if (error && error.status === 404) {
    return <KnowledgebaseNotFound />;
  }

  return children;
}
