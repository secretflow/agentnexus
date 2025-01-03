"use client";

import { SettingsLayout } from "@/components/layout/settings-layout";
import { Cog, KeyRound } from "lucide-react";
import type { ReactNode } from "react";

export default function ApplicationSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const tabs = [
    {
      group: "应用设置",
      tabs: [
        {
          name: "通用",
          icon: Cog,
          segment: null,
        },
        {
          name: "API 密钥",
          icon: KeyRound,
          segment: "tokens",
        },
      ],
    },
  ];

  return (
    <SettingsLayout tabs={tabs} tabContainerClassName="top-16">
      {children}
    </SettingsLayout>
  );
}
