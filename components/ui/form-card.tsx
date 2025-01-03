"use client";

import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, type ReactNode, useMemo, useState } from "react";
import { Button } from "./button";

export function FormCard({
  title,
  description,
  inputAttrs,
  helpText,
  buttonText = "保存修改",
  disabledTooltip,
  handleSubmit,
}: {
  title: string;
  description: string;
  inputAttrs: InputHTMLAttributes<HTMLInputElement>;
  helpText?: string | ReactNode;
  buttonText?: string;
  disabledTooltip?: string | ReactNode;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  handleSubmit: (data: any) => Promise<any>;
}) {
  const [value, setValue] = useState(inputAttrs.defaultValue);
  const [saving, setSaving] = useState(false);
  const saveDisabled = useMemo(() => {
    return saving || !value || value === inputAttrs.defaultValue;
  }, [saving, value, inputAttrs.defaultValue]);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        await handleSubmit({
          [inputAttrs.name as string]: value,
        });
        setSaving(false);
      }}
      className="rounded-lg border border-gray-200 bg-white"
    >
      <div className="relative flex flex-col space-y-6 p-5 sm:p-10">
        <div className="flex flex-col space-y-3">
          <h2 className="font-medium text-xl">{title}</h2>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
        {typeof inputAttrs.defaultValue === "string" ? (
          <input
            {...inputAttrs}
            type={inputAttrs.type || "text"}
            required
            disabled={disabledTooltip ? true : false}
            onChange={(e) => setValue(e.target.value)}
            className={cn(
              "w-full max-w-md rounded-md border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm",
              {
                "cursor-not-allowed bg-gray-100 text-gray-400": disabledTooltip,
              },
            )}
          />
        ) : (
          <div className="h-[2.35rem] w-full max-w-md animate-pulse rounded-md bg-gray-200" />
        )}
      </div>

      <div className="flex items-center justify-between space-x-4 rounded-b-lg border-gray-200 border-t bg-gray-50 p-3 sm:px-10">
        {typeof helpText === "string" ? (
          <p
            className="prose-sm text-gray-500 prose-a:underline prose-a:underline-offset-4 transition-colors hover:prose-a:text-gray-700"
            dangerouslySetInnerHTML={{ __html: helpText || "" }}
          />
        ) : (
          helpText
        )}
        <div className="shrink-0">
          <Button
            text={buttonText}
            loading={saving}
            disabled={saveDisabled}
            disabledTooltip={disabledTooltip}
          />
        </div>
      </div>
    </form>
  );
}
