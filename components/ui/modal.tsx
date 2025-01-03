"use client";

import { useMediaQuery } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";
import type { ComponentProps, Dispatch, SetStateAction } from "react";
import { Drawer } from "vaul";

export function Modal({
  children,
  className,
  showModal,
  setShowModal,
  onClose,
  desktopOnly,
  preventDefaultClose,
  drawerRootProps,
}: {
  children: React.ReactNode;
  className?: string;
  showModal?: boolean;
  setShowModal?: Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
  desktopOnly?: boolean;
  preventDefaultClose?: boolean;
  drawerRootProps?: ComponentProps<typeof Drawer.Root>;
}) {
  const router = useRouter();

  const closeModal = ({ dragged }: { dragged?: boolean } = {}) => {
    if (preventDefaultClose && !dragged) {
      return;
    }
    // fire onClose event if provided
    onClose?.();

    // if setShowModal is defined, use it to close modal
    if (setShowModal) {
      setShowModal(false);
      // else, this is intercepting route @modal
    } else {
      router.back();
    }
  };
  const { isMobile } = useMediaQuery();

  if (isMobile && !desktopOnly) {
    return (
      <Drawer.Root
        open={setShowModal ? showModal : true}
        onOpenChange={(open) => {
          if (!open) {
            closeModal({ dragged: true });
          }
        }}
        {...drawerRootProps}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-gray-100 bg-opacity-10 backdrop-blur" />
          <Drawer.Content
            className={cn(
              "fixed right-0 bottom-0 left-0 z-50 rounded-t-[10px] border-gray-200 border-t bg-white",
              className,
            )}
          >
            <VisuallyHidden.Root>
              <Drawer.Title>Modal</Drawer.Title>
              <Drawer.Description>This is a modal</Drawer.Description>
            </VisuallyHidden.Root>
            <div className="sticky top-0 z-20 flex w-full items-center justify-center rounded-t-[10px] bg-inherit">
              <div className="my-3 h-1 w-12 rounded-full bg-gray-300" />
            </div>
            {children}
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <Dialog.Root
      open={setShowModal ? showModal : true}
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          // for detecting when there's an active opened modal
          id="modal-backdrop"
          className="fixed inset-0 z-40 animate-fade-in bg-gray-100 bg-opacity-50 backdrop-blur-md"
        />
        <Dialog.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={cn(
            "fixed inset-0 z-40 m-auto max-h-fit w-full max-w-md animate-scale-in overflow-hidden border border-gray-200 bg-white p-0 shadow-xl sm:rounded-2xl",
            className,
          )}
        >
          <VisuallyHidden.Root>
            <Dialog.Title>Modal</Dialog.Title>
            <Dialog.Description>This is a modal</Dialog.Description>
          </VisuallyHidden.Root>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
