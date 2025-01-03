import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui";
import { useMutationObserver } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import type { VariableProps, VariableRefProps } from "@/lib/zod";
import { CheckIcon } from "@radix-ui/react-icons";
import { Variable } from "lucide-react";
import { useRef } from "react";
import type { VariableRefGroup } from "./types";

export function VariableRefPanel({
  value,
  onChange,
  availableVariableRefs,
  className,
}: {
  value: VariableRefProps["ref"];
  onChange: (value: VariableRefProps["ref"]) => void;
  availableVariableRefs: VariableRefGroup[];
  className?: string;
}) {
  return (
    <Command className="text-gray-700" loop>
      <CommandInput placeholder="搜索变量名..." className="h-8" />
      <CommandList className={className}>
        <CommandEmpty>未找到结果</CommandEmpty>
        {availableVariableRefs.map(({ nodeId, title, icon: Icon, variables }) => (
          <CommandGroup
            key={nodeId}
            heading={
              <div className="flex items-center space-x-1 text-gray-700 text-xs">
                <Icon className="size-4 text-gray-500" />
                <span>{title}</span>
              </div>
            }
          >
            {variables.map((variable) => (
              <VariableRefItem
                key={variable.name}
                nodeId={nodeId}
                variable={variable}
                onSelect={() => {
                  onChange({
                    nodeId,
                    variable: variable.name,
                  });
                }}
                isSelected={value?.nodeId === nodeId && value.variable === variable.name}
              />
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </Command>
  );
}

interface VariableRefItemProps {
  nodeId: string;
  variable: VariableProps;
  isSelected: boolean;
  onSelect: () => void;
  onPeek?: (model: VariableProps) => void;
}

function VariableRefItem({ nodeId, variable, isSelected, onSelect, onPeek }: VariableRefItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  useMutationObserver(ref, (mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        if (mutation.attributeName === "aria-selected") {
          onPeek?.(variable);
        }
      }
    }
  });

  return (
    <CommandItem
      ref={ref}
      key={variable.name}
      value={`${nodeId}:${variable.name}`}
      onSelect={onSelect}
      className="h-6 cursor-pointer text-gray-700 text-xs aria-selected:bg-primary aria-selected:text-primary-foreground"
    >
      <Variable className="size-4 text-gray-500" />
      <span className="ml-2">{variable.name}</span>
      <CheckIcon className={cn("ml-auto size-4", isSelected ? "opacity-100" : "opacity-0")} />
    </CommandItem>
  );
}
