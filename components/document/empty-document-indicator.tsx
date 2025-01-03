"use client";

import { useUpsertDocumentModal } from "@/components/modals";
import { Button } from "@/components/ui";
import Image from "next/image";

export function EmptyDocumentIndicator() {
  const { setShowUpsertDocumentModal, UpsertDocumentModal } = useUpsertDocumentModal();

  return (
    <div className="col-span-3 flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white py-10">
      <h2 className="z-10 font-semibold text-gray-700 text-xl">当前知识库还没有添加文档</h2>
      <Image
        src="/_static/no-data.svg"
        alt="No workspace yet"
        width={380}
        height={380}
        className="pointer-events-none"
        priority
      />
      <Button
        text="添加文档"
        onClick={() => {
          setShowUpsertDocumentModal(true);
        }}
        className="w-auto"
      />
      <UpsertDocumentModal />
    </div>
  );
}
