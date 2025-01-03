"use client";

import { Github, Google } from "@/components/icons";
import { Button } from "@/components/ui";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export const authMethods = ["google", "github"] as const;
export type AuthMethod = (typeof authMethods)[number];

export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams?.get("next");

  const [authMethod, setAuthMethod] = useState<AuthMethod | undefined>("github");
  const [clickedMethod, setClickedMethod] = useState<AuthMethod | undefined>(undefined);

  const GoogleButton = () => {
    return (
      <Button
        text="使用 Google 登录"
        variant="secondary"
        onClick={() => {
          setClickedMethod("google");
          signIn("google", {
            redirectTo: "/workspaces",
            ...(next && next.length > 0 ? { callbackUrl: next } : {}),
          });
        }}
        loading={clickedMethod === "google"}
        disabled={clickedMethod && clickedMethod !== "google"}
        icon={<Google className="size-4" />}
        disabledTooltip="Google 登录暂未开放"
      />
    );
  };

  const GitHubButton = () => {
    return (
      <Button
        text="使用 Github 登录"
        variant="secondary"
        onClick={() => {
          setClickedMethod("github");
          signIn("github", {
            redirectTo: next && next.length > 0 ? next : "/workspaces",
          });
        }}
        loading={clickedMethod === "github"}
        disabled={clickedMethod && clickedMethod !== "github"}
        icon={<Github className="size-4 text-black" />}
      />
    );
  };

  const authProviders = [
    {
      method: "google",
      component: <GoogleButton />,
    },
    {
      method: "github",
      component: <GitHubButton />,
    },
  ];

  const authMethodComponent = authProviders.find(
    (provider) => provider.method === authMethod,
  )?.component;

  return (
    <div className="grid gap-3 p-1">
      {authMethod && (
        <div className="flex flex-col gap-2">
          {authMethodComponent}
          <div className="my-2 flex flex-shrink items-center justify-center gap-2">
            <div className="grow basis-0 border-gray-300 border-b" />
            <span className="font-normal text-gray-500 text-xs uppercase leading-none">or</span>
            <div className="grow basis-0 border-gray-300 border-b" />
          </div>
        </div>
      )}
      {authProviders
        .filter((provider) => provider.method !== authMethod)
        .map((provider) => (
          <div key={provider.method}>{provider.component}</div>
        ))}
    </div>
  );
}
