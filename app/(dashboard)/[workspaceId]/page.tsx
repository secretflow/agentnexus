"use client";

import {
  ApplicationList,
  type ApplicationTypeOrAll,
  ApplicationTypeToggle,
  CreateApplicationButton,
} from "@/components/application";
import { MaxWidthWrapper } from "@/components/layout";
import { SearchBox } from "@/components/ui";
import { useState } from "react";

export default function Applications() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<ApplicationTypeOrAll>("all");

  return (
    <MaxWidthWrapper>
      <div className="my-8 flex items-center justify-between">
        <h1 className="truncate text-2xl text-gray-600">应用列表</h1>
        <div className="flex items-center space-x-4">
          <SearchBox value={search} onChange={setSearch} placeholder="搜索名称或描述..." />
          <ApplicationTypeToggle value={type} onChange={setType} />
          <CreateApplicationButton />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <ApplicationList search={search} type={type} />
      </div>
    </MaxWidthWrapper>
  );
}
