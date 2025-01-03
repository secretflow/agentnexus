import type { ReactNode } from "react";
import { ApplicationAuth } from "./auth";

export default function ApplicationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ApplicationAuth>{children}</ApplicationAuth>;
}
