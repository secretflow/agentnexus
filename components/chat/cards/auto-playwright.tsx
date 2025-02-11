import { LoadingSpinner, Tooltip } from "@/components/ui";
import { useMemo } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type ToolProps = { toolName: string; args: any };
type ExecutionResult = ToolProps[];

export function AutoPlaywright({
  result,
  loading,
}: {
  result?: ExecutionResult;
  loading?: boolean;
}) {
  const [snapshot, setSnapshot] = useState<string>();

  const runTool = (tool: ToolProps) => {
    return new Promise<void>((resolve, reject) => {
      fetch("/api/simulator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool,
        }),
      }).then(async (res) => {
        if (res.ok) {
          const json = await res.json();
          setSnapshot(json.screenshot);
          resolve();
        } else {
          const { message } = await res.json();
          toast.error(message);
          reject();
        }
      });
    });
  };

  const runTools = async (tools: ToolProps[]) => {
    for (const tool of tools) {
      await runTool(tool);
      await delay(500);
    }
  };

  useEffect(() => {
    if (!loading && result) {
      runTools(result);
    }
  }, [loading, result]);

  return (
    <div className="h-[400px] w-[400px] rounded-m shadow-lg">
      {loading ? (
        <LoadingSpinner className="size-4" />
      ) : (
        <img src={snapshot} alt="screenshot" className="h-full w-full" />
      )}
    </div>
  );
}
