"use client";

import { useMediaQuery } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import type { PropsWithChildren, ReactNode, WheelEventHandler } from "react";
import { Drawer } from "vaul";

export type PopoverProps = PropsWithChildren<{
  content: ReactNode | string;
  align?: "center" | "start" | "end";
  side?: "bottom" | "top" | "left" | "right";
  openPopover: boolean;
  setOpenPopover: (open: boolean) => void;
  mobileOnly?: boolean;
  popoverContentClassName?: string;
  collisionBoundary?: Element | Element[];
  sticky?: "partial" | "always";
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onWheel?: WheelEventHandler;
}>;

export function Popover({
  children,
  content,
  align = "center",
  side = "bottom",
  openPopover,
  setOpenPopover,
  mobileOnly,
  popoverContentClassName,
  collisionBoundary,
  sticky,
  onEscapeKeyDown,
  onWheel,
}: PopoverProps) {
  const { isMobile } = useMediaQuery();

  if (mobileOnly || isMobile) {
    return (
      <Drawer.Root open={openPopover} onOpenChange={setOpenPopover}>
        <Drawer.Trigger className="sm:hidden" asChild>
          {children}
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-gray-100 bg-opacity-10 backdrop-blur" />
          <Drawer.Content
            className="fixed right-0 bottom-0 left-0 z-50 mt-24 rounded-t-[10px] border-gray-200 border-t bg-white"
            onEscapeKeyDown={onEscapeKeyDown}
          >
            <div className="sticky top-0 z-20 flex w-full items-center justify-center rounded-t-[10px] bg-inherit">
              <div className="my-3 h-1 w-12 rounded-full bg-gray-300" />
            </div>
            <div className="flex min-h-[150px] w-full items-center justify-center overflow-hidden bg-white pb-8 align-middle shadow-xl">
              {content}
            </div>
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <PopoverPrimitive.Root open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverPrimitive.Trigger className="sm:inline-flex" asChild>
        {children}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={8}
          align={align}
          side={side}
          className={cn(
            "z-50 animate-slide-up-fade items-center rounded-lg border border-gray-200 bg-white drop-shadow-lg sm:block",
            popoverContentClassName,
          )}
          sticky={sticky}
          collisionBoundary={collisionBoundary}
          onEscapeKeyDown={onEscapeKeyDown}
          onWheel={onWheel}
        >
          {content}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
