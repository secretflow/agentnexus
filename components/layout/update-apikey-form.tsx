"use client";

import { Background, EmptyState } from "@/components/layout";
import { Button, Input } from "@/components/ui";
import { useState } from "react";

export function UpdateApiKeyForm({
  title,
  message,
  icon,
  onConfirm,
}: {
  title: string;
  message: string;
  icon: React.ElementType;
  onConfirm?: (key: string) => void;
}) {
  const [key, setKey] = useState("");

  return (
    <>
      <Background />
      <div className="relative z-10 flex min-h-screen w-screen justify-center">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <EmptyState icon={icon} title={title} description={message} />
          <div className="flex gap-2">
            <Input
              className="w-[300px]"
              placeholder="请输入 API 秘钥"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            <div>
              <Button
                disabled={!key}
                className="h-9"
                text="验证"
                onClick={() => {
                  onConfirm?.(key);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
