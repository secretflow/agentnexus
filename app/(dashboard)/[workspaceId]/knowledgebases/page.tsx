"use client";

import { CreateKnowledgebaseButton, KnowledgebaseList } from "@/components/knowledgebase";
import { MaxWidthWrapper } from "@/components/layout";
import { SearchBox } from "@/components/ui";
import { useState } from "react";

export default function Knowledgebases() {
  const [search, setSearch] = useState("");

  return (
    <MaxWidthWrapper>
      <div className="my-8 flex items-center justify-between">
        <h1 className="truncate text-2xl text-gray-600">知识库列表</h1>
        <div className="flex items-center space-x-4">
          <SearchBox value={search} onChange={setSearch} placeholder="搜索名称或描述..." />
          <CreateKnowledgebaseButton />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <KnowledgebaseList search={search} />
      </div>
    </MaxWidthWrapper>
  );
}
