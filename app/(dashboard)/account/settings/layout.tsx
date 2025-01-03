"use client";

import { Gear } from "@/components/icons";
import { SettingsLayout } from "@/components/layout/settings-layout";
import type { ReactNode } from "react";

export default function AccountSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const tabs = [
    {
      group: "账号设置",
      tabs: [
        {
          name: "通用",
          icon: Gear,
          segment: null,
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
