"use client";

import { ApplicationNotFound } from "@/components/application";
import { LayoutLoader } from "@/components/layout";
import { useApplication } from "@/lib/swr";
import type { ReactNode } from "react";

export function ApplicationAuth({ children }: { children: ReactNode }) {
  const { loading, error } = useApplication();

  if (loading) {
    return <LayoutLoader />;
  }

  if (error && error.status === 404) {
    return <ApplicationNotFound />;
  }

  return children;
}
