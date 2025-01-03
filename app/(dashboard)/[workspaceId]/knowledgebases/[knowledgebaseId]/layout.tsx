import type { ReactNode } from "react";
import { KnowledgebaseAuth } from "./auth";

export default function KnowledgebaseLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <KnowledgebaseAuth>{children}</KnowledgebaseAuth>;
}
