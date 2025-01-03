"use client";

import { ModalContext } from "@/components/modals";
import { Button } from "@/components/ui";
import Image from "next/image";
import { useContext } from "react";

export function EmptyKnowledgebaseIndicator() {
  const { setShowAddKnowledgebaseModal } = useContext(ModalContext);

  return (
    <div className="col-span-3 flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white py-10">
      <h2 className="z-10 font-semibold text-gray-700 text-xl">当前工作空间还没有知识库</h2>
      <Image
        src="/_static/no-data.svg"
        alt="No workspace yet"
        width={380}
        height={380}
        className="pointer-events-none"
        priority
      />
      <Button
        text="创建知识库"
        onClick={() => {
          setShowAddKnowledgebaseModal(true);
        }}
        className="w-auto"
      />
    </div>
  );
}
