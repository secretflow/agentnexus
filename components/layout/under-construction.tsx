import { MaxWidthWrapper } from "@/components/layout";
import { Construction } from "lucide-react";
import { Link } from "next-view-transitions";
import Image from "next/image";

export function UnderConstruction() {
  return (
    <MaxWidthWrapper>
      <div className="mt-6 flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white py-6">
        <div className="rounded-full bg-gray-100 p-3">
          <Construction className="size-6 text-gray-600" />
        </div>
        <h1 className="my-3 font-semibold text-gray-700 text-xl">功能建设中</h1>
        <p className="z-10 max-w-sm text-center text-gray-600 text-sm">
          该功能正在建设中， 请耐心等待。
        </p>
        <Image
          src="/_static/under-construction.svg"
          alt="Workspace not found"
          width={380}
          height={380}
          priority
        />
        <Link
          href="/workspaces"
          className="z-10 rounded-md border border-black bg-black px-10 py-2 font-medium text-sm text-white transition-all duration-75 hover:bg-white hover:text-black"
        >
          返回我的工作空间
        </Link>
      </div>
    </MaxWidthWrapper>
  );
}
