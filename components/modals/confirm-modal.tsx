"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui";
import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";

function ConfirmModal({
  title,
  content,
  onCancel,
  onConfirm,
  showConfirmModal,
  setShowConfirmModal,
}: {
  title: string;
  content: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  showConfirmModal: boolean;
  setShowConfirmModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{content}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => onCancel?.()}
            className="rounded-md border border-input px-4 py-2 text-sm"
          >
            取消
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm?.()} className="rounded-md px-4 py-2 text-sm">
            确认
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function useConfirmModal({
  title,
  content,
  onCancel,
  onConfirm,
}: {
  title: string;
  content: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const ConfirmModalCallback = useCallback(() => {
    return (
      <ConfirmModal
        title={title}
        content={content}
        onCancel={onCancel}
        onConfirm={onConfirm}
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
      />
    );
  }, [showConfirmModal, setShowConfirmModal]);

  return useMemo(
    () => ({ setShowConfirmModal, ConfirmModal: ConfirmModalCallback }),
    [setShowConfirmModal, ConfirmModalCallback],
  );
}
