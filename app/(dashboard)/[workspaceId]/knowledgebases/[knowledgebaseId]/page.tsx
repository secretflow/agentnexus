"use client";

import { CreateDocumentButton, DocumentContainer } from "@/components/document";
import { MaxWidthWrapper } from "@/components/layout";
import { SearchBox } from "@/components/ui";
import { useState } from "react";

export default function Knowledgebase() {
  const [search, setSearch] = useState("");

  return (
    <MaxWidthWrapper className="max-w-screen-xl">
      <div className="my-8 flex items-center justify-between">
        <h1 className="truncate text-2xl text-gray-600">知识库文档</h1>
        <div className="flex items-center space-x-4">
          <SearchBox value={search} onChange={setSearch} placeholder="搜索文档名称..." />
          <CreateDocumentButton />
        </div>
      </div>
      <div className="mt-3">
        <DocumentContainer search={search} />
      </div>
    </MaxWidthWrapper>
  );
}
