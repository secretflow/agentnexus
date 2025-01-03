import { Switch } from "@/components/ui";
import { SCENE, TOOL_ATTRS } from "@/lib/constants";
import { type ToolProvider, getToolProvider, getToolProviderList } from "@/lib/tools";
import type { ChatToolProps } from "@/lib/zod";
import { Trash2 } from "lucide-react";
import { useCallback } from "react";
import { useMemo } from "react";
import { toast } from "sonner";
import { ToolSelector } from "./tool-selector";

export function ToolsForm({
  value,
  onValueChange,
}: {
  value: ChatToolProps[] | undefined | null;
  onValueChange: (value: ChatToolProps[]) => void;
}) {
  const tools = getToolProviderList();
  const availableTools = useMemo(() => {
    return tools.filter((t) => {
      const attr = TOOL_ATTRS[t.id as keyof typeof TOOL_ATTRS];
      if (!attr.scene.includes(SCENE.agent)) {
        return false;
      }
      return !value?.find((v) => v.id === t.id);
    });
  }, [value]);

  const handleAddTool = useCallback(
    (tool: ToolProvider) => {
      if (value?.find((v) => v.id === tool.id)) {
        toast.info("工具已存在");
        return;
      }
      onValueChange([...(value || []), { id: tool.id, enabled: true }]);
    },
    [value],
  );

  const handleDeleteTool = useCallback(
    (id: string) => {
      onValueChange((value || []).filter((v) => v.id !== id));
    },
    [value],
  );

  const handleToggleToolStatus = useCallback(
    (id: string, enabled: boolean) => {
      onValueChange(
        (value || []).map((v) => {
          if (v.id === id) {
            return { ...v, enabled };
          }
          return v;
        }),
      );
    },
    [value],
  );

  return (
    <div className="relative flex flex-col space-y-4 px-6 py-4">
      <div className="flex flex-col space-y-3">
        <h2 className="font-medium text-xl">工具</h2>
        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-sm">Agent 会自主调用合适的工具处理复杂任务</p>
          <ToolSelector onSelect={handleAddTool} tools={availableTools} />
        </div>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-3">
        {(value || []).map((tool) => {
          return (
            <div
              key={tool.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-2"
            >
              <ToolCardTitleColumn tool={tool} />
              <div className="flex items-center space-x-3">
                <Switch
                  checked={tool.enabled}
                  fn={(checked: boolean) => {
                    handleToggleToolStatus(tool.id, checked);
                  }}
                />
                <Trash2
                  className="size-4 cursor-pointer text-red-500 hover:text-red-600"
                  onClick={() => handleDeleteTool(tool.id)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ToolCardTitleColumn({
  tool,
}: {
  tool: ChatToolProps;
}) {
  const toolProvider = getToolProvider(tool.id);

  if (!toolProvider) {
    return null;
  }

  const Icon = toolProvider.icon;

  return (
    <div className="flex min-w-0 items-center gap-4">
      <div className="hidden rounded-full border border-gray-200 sm:block">
        <div className="rounded-full border border-white bg-gradient-to-t from-gray-100 p-1 md:p-2">
          <Icon className="size-4" />
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <p className="truncate font-medium text-sm">{toolProvider.name}</p>
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs">
          <span className="whitespace-pre-wrap text-gray-500" title={toolProvider.introduction}>
            {toolProvider.introduction}
          </span>
        </div>
      </div>
    </div>
  );
}
