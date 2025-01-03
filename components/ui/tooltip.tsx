"use client";

import { cn } from "@/lib/utils";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import { Badge } from "./badge";
import { Button, type ButtonProps, buttonVariants } from "./button";

export function TooltipProvider({ children }: { children: ReactNode }) {
  return <TooltipPrimitive.Provider delayDuration={150}>{children}</TooltipPrimitive.Provider>;
}

export interface TooltipProps extends Omit<TooltipPrimitive.TooltipContentProps, "content"> {
  content: ReactNode | string | ((props: { setOpen: (open: boolean) => void }) => ReactNode);
  disableHoverableContent?: TooltipPrimitive.TooltipProps["disableHoverableContent"];
}

export function Tooltip({
  children,
  content,
  side = "top",
  disableHoverableContent,
  ...rest
}: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipPrimitive.Root
      open={open}
      onOpenChange={setOpen}
      delayDuration={0}
      disableHoverableContent={disableHoverableContent}
    >
      <TooltipPrimitive.Trigger
        asChild
        onClick={() => {
          setOpen(true);
        }}
        onBlur={() => {
          setOpen(false);
        }}
      >
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          sideOffset={8}
          side={side}
          className="z-[99] animate-slide-up-fade items-center overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm"
          collisionPadding={0}
          {...rest}
        >
          {typeof content === "string" ? (
            <span className="block max-w-xs text-pretty px-4 py-2 text-left text-gray-700 text-sm">
              {content}
            </span>
          ) : typeof content === "function" ? (
            content({ setOpen })
          ) : (
            content
          )}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

export function TooltipContent({
  title,
  cta,
  href,
  target,
  onClick,
}: {
  title: ReactNode;
  cta?: string;
  href?: string;
  target?: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex max-w-xs flex-col items-center space-y-3 p-4 text-center">
      <p className="text-gray-700 text-sm">{title}</p>
      {cta &&
        (href ? (
          <Link
            href={href}
            {...(target ? { target } : {})}
            className={cn(
              buttonVariants({ variant: "primary" }),
              "flex h-9 w-full items-center justify-center whitespace-nowrap rounded-md border px-4 text-sm",
            )}
          >
            {cta}
          </Link>
        ) : onClick ? (
          <Button onClick={onClick} text={cta} variant="primary" className="h-9" />
        ) : null)}
    </div>
  );
}

export function SimpleTooltipContent({
  title,
  cta,
  href,
}: {
  title: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="max-w-xs px-4 py-2 text-center text-gray-700 text-sm">
      {title}{" "}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="inline-flex text-gray-500 underline underline-offset-4 hover:text-gray-800"
      >
        {cta}
      </a>
    </div>
  );
}

export function InfoTooltip(props: Omit<TooltipProps, "children">) {
  return (
    <Tooltip {...props}>
      <HelpCircle className="size-4 text-gray-500" />
    </Tooltip>
  );
}

export function BadgeTooltip({ children, content, ...props }: TooltipProps) {
  return (
    <Tooltip content={content} {...props}>
      <div className="flex cursor-pointer items-center">
        <Badge variant="gray" className="border-gray-300 transition-all hover:bg-gray-200">
          {children}
        </Badge>
      </div>
    </Tooltip>
  );
}

export function ButtonTooltip({
  children,
  tooltipProps,
  ...props
}: {
  children: ReactNode;
  tooltipProps: TooltipProps;
} & ButtonProps) {
  return (
    <Tooltip {...tooltipProps}>
      <button
        type="button"
        {...props}
        className={cn(
          "flex size-6 items-center justify-center rounded-md text-gray-500 transition-colors duration-75 hover:bg-gray-100 active:bg-gray-200 disabled:cursor-not-allowed disabled:hover:bg-transparent",
          props.className,
        )}
      >
        {children}
      </button>
    </Tooltip>
  );
}
