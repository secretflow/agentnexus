import { MaxWidthWrapper } from "@/components/layout";
import { CreateWorkspaceButton, WorkspaceList } from "@/components/workspace";

export default function Workspaces() {
  return (
    <>
      <div className="flex h-20 items-center border-gray-200 border-b bg-gray-50/80">
        <MaxWidthWrapper>
          <div className="flex items-center justify-between">
            <h1 className="truncate text-2xl text-gray-600">我的工作空间</h1>
            <CreateWorkspaceButton />
          </div>
        </MaxWidthWrapper>
      </div>
      <MaxWidthWrapper>
        <div className="my-8 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          <WorkspaceList />
        </div>
      </MaxWidthWrapper>
    </>
  );
}
