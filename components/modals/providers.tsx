"use client";

import { type Dispatch, type ReactNode, type SetStateAction, Suspense, createContext } from "react";

import { useAddApplicationModal } from "./add-application-modal";
import { useAddKnowledgebaseModal } from "./add-knowledgebase-modal";
import { useAddWorkspaceModal } from "./add-workspace-modal";

export const ModalContext = createContext<{
  setShowAddWorkspaceModal: Dispatch<SetStateAction<boolean>>;
  setShowAddApplicationModal: Dispatch<SetStateAction<boolean>>;
  setShowAddKnowledgebaseModal: Dispatch<SetStateAction<boolean>>;
}>({
  setShowAddWorkspaceModal: () => {},
  setShowAddApplicationModal: () => {},
  setShowAddKnowledgebaseModal: () => {},
});

export function ModalProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <ModalProviderClient>{children}</ModalProviderClient>
    </Suspense>
  );
}

function ModalProviderClient({ children }: { children: ReactNode }) {
  const { AddWorkspaceModal, setShowAddWorkspaceModal } = useAddWorkspaceModal();
  const { AddApplicationModal, setShowAddApplicationModal } = useAddApplicationModal();
  const { AddKnowledgebaseModal, setShowAddKnowledgebaseModal } = useAddKnowledgebaseModal();

  return (
    <ModalContext.Provider
      value={{
        setShowAddWorkspaceModal,
        setShowAddApplicationModal,
        setShowAddKnowledgebaseModal,
      }}
    >
      <AddWorkspaceModal />
      <AddApplicationModal />
      <AddKnowledgebaseModal />
      {children}
    </ModalContext.Provider>
  );
}
