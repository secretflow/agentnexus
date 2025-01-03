import {
  Button,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
} from "@/components/ui";
import { TOOL_ATTRS } from "@/lib/constants";
import type { ToolProvider } from "@/lib/tools";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";

export function ToolSelector({
  tools,
  onSelect,
}: {
  tools: ToolProvider[];
  onSelect: (tool: ToolProvider) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Popover
        side="top"
        openPopover={open}
        setOpenPopover={setOpen}
        content={
          <Command loop>
            <CommandList className="h-[var(--cmdk-list-height)] max-h-[400px]">
              <CommandInput placeholder="搜索工具..." />
              <CommandEmpty className="flex h-[60px] items-center justify-center text-gray-500 text-sm">
                未找到结果
              </CommandEmpty>
              {tools.map((tool) => (
                <ToolItem
                  key={tool.id}
                  tool={tool}
                  onSelect={() => {
                    onSelect(tool);
                    setOpen(false);
                  }}
                />
              ))}
            </CommandList>
          </Command>
        }
      >
        <Button
          variant="secondary"
          className="size-8 px-0"
          onClick={() => {}}
          icon={<PlusIcon className="size-4 text-gray-500" />}
        />
      </Popover>
    </div>
  );
}

interface ToolItemProps {
  tool: ToolProvider;
  onSelect: () => void;
}

function ToolItem({ tool, onSelect }: ToolItemProps) {
  const Icon = useMemo(() => {
    const icon = TOOL_ATTRS[tool.id as keyof typeof TOOL_ATTRS]?.icon;
    if (!icon) return null;
    return icon;
  }, [tool]);

  return (
    <CommandItem
      key={tool.id}
      value={tool.id}
      onSelect={onSelect}
      className="cursor-pointer aria-selected:bg-primary aria-selected:text-primary-foreground"
    >
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      <span className="flex items-center">{tool.name}</span>
    </CommandItem>
  );
}
