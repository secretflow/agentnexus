import { LoadingSpinner } from "@/components/ui";
import { useMemo } from "react";

type ExecutionResult = { text: string | undefined }[];

export function PythonConsole({
  result,
  loading,
  args,
}: {
  result?: ExecutionResult;
  loading?: boolean;
  args?: { code: string };
}) {
  const output = useMemo(() => {
    if (loading) {
      return (
        <div className="flex items-center gap-1">
          <span className="text-green-500">&gt;</span>
          <span>{args?.code}</span>
          <LoadingSpinner className="size-4" />
        </div>
      );
    }
    return (
      <>
        <div className="flex items-center gap-1">
          <span className="text-green-500">&gt;</span>
          <span>{args?.code}</span>
        </div>
        {result?.map((line, index) => (
          <div key={index} className="pl-3">
            {line.text}
          </div>
        ))}
      </>
    );
  }, [result, loading]);

  return (
    <div className="w-[400px] rounded-md bg-gray-800 px-3 py-2 text-primary-foreground text-sm">
      {output}
    </div>
  );
}
