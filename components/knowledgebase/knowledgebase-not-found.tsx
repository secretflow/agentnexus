import { MaxWidthWrapper } from "@/components/layout";
import { FileX2 } from "lucide-react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { useParams } from "next/navigation";

export function KnowledgebaseNotFound() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  return (
    <MaxWidthWrapper>
      <div className="mt-6 flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white py-6">
        <div className="rounded-full bg-gray-100 p-3">
          <FileX2 className="size-6 text-gray-600" />
        </div>
        <h1 className="my-3 font-semibold text-gray-700 text-xl">知识库不存在</h1>
        <p className="z-10 max-w-sm text-center text-gray-600 text-sm">
          你访问的知识库不存在。你可能输入了错误的 URL 地址或者没有访问此知识库的权限。
        </p>
        <Image
          src="/_static/not-found.svg"
          alt="Workspace not found"
          width={380}
          height={380}
          priority
        />
        <Link
          href={`/${workspaceId}/knowledgebases`}
          className="z-10 rounded-md border border-black bg-black px-10 py-2 font-medium text-sm text-white transition-all duration-75 hover:bg-white hover:text-black"
        >
          返回知识库列表
        </Link>
      </div>
    </MaxWidthWrapper>
  );
}
