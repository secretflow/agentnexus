"use client";

import { SettingsLayout } from "@/components/layout/settings-layout";
import { Cog, Users } from "lucide-react";
import type { ReactNode } from "react";

export default function WorkspaceSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const tabs = [
    {
      group: "工作空间设置",
      tabs: [
        {
          name: "通用",
          icon: Cog,
          segment: null,
        },
        {
          name: "成员",
          icon: Users,
          segment: "members",
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
