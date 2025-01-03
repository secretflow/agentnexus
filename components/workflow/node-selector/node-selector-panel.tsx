import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui";
import { NODE_ATTRS, SCENE, TOOL_ATTRS } from "@/lib/constants";

export function NodeSelectorPanel({
  onSelect,
}: {
  onSelect: (value: string) => void;
}) {
  const nodes = Object.values(NODE_ATTRS).filter((attr) => attr.scene.includes(SCENE.workflow));
  const tools = Object.values(TOOL_ATTRS).filter((attr) => attr.scene.includes(SCENE.workflow));

  return (
    <Command className="text-gray-700">
      <CommandInput placeholder="搜索名称..." />
      <CommandList>
        <CommandEmpty>未找到结果</CommandEmpty>
        <CommandGroup heading="节点">
          {nodes.map(({ id, name, icon: Icon }) => (
            <CommandItem key={id} value={id} className="cursor-pointer" onSelect={onSelect}>
              <Icon className="size-4 text-gray-500" />
              <span className="ml-2">{name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="工具">
          {tools.map(({ id, name, icon: Icon }) => (
            <CommandItem key={id} value={id} className="cursor-pointer" onSelect={onSelect}>
              <Icon className="h-4 w-4" />
              <span className="ml-2">{name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
