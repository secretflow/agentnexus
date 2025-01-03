import { Analytics } from "@/components/analytics";
import { MaxWidthWrapper } from "@/components/layout";

export default function AnalyticsPage() {
  return (
    <>
      <div className="flex h-20 items-center border-gray-200 bg-gray-50/80">
        <MaxWidthWrapper>
          <div className="flex items-center justify-between">
            <h1 className="truncate text-2xl text-gray-600">数据分析</h1>
          </div>
        </MaxWidthWrapper>
      </div>
      <MaxWidthWrapper>
        <Analytics />
      </MaxWidthWrapper>
    </>
  );
}
