"use client";

import { Key } from "@/components/icons";
import { LayoutLoader } from "@/components/layout";
import { UpdateApiKeyForm } from "@/components/layout";
import { LoadingSpinner } from "@/components/ui";
import { useLocalStorage } from "@/lib/hooks";
import { useChatApp } from "@/lib/swr";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

export function ChatAppAuth({ children }: { children: ReactNode }) {
  const { appId } = useParams<{ appId?: string }>();

  const { loading, error } = useChatApp();
  const [apiKey, setApiKey] = useLocalStorage<string>("agentnexus_chat_api_key", "");

  const [validating, setValidating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateApiKey = async (key: string) => {
    if (!key) return;
    setApiKey(key);
    setValidating(true);
    const res = await fetch(`/api/apps/${appId}/auth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
    });
    if (res.ok) {
      setValidating(false);
      setErrorMessage(null);
    } else {
      const { message } = await res.json();
      setValidating(false);
      setErrorMessage(message);
    }
  };

  useEffect(() => {
    if (apiKey) {
      validateApiKey(apiKey);
    }
  }, []);

  if (loading) {
    return <LayoutLoader />;
  }

  if (error) {
    return notFound();
  }

  if (!apiKey) {
    return (
      <UpdateApiKeyForm
        icon={Key}
        title="完善 API 秘钥"
        message="需要 API 秘钥才能访问此应用，请联系应用管理员获取秘钥"
        onConfirm={validateApiKey}
      />
    );
  }

  if (validating) {
    return (
      <UpdateApiKeyForm
        icon={LoadingSpinner}
        title="验证 API 秘钥"
        message="正在验证您的 API 秘钥，该过程可能需要几秒钟..."
      />
    );
  }

  if (errorMessage) {
    return (
      <UpdateApiKeyForm
        icon={Key}
        title="API 秘钥验证失败"
        message={errorMessage}
        onConfirm={validateApiKey}
      />
    );
  }

  return children;
}
