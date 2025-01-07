import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useRef, useState } from "react";

import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
} from "@/components/ui";
import { LoadingSpinner } from "@/components/ui";
import { useMutationObserver } from "@/lib/hooks";
import { useModelProviders } from "@/lib/swr";
import { cn } from "@/lib/utils";
import type { ModelProps } from "@/lib/zod";
import { useModelIcon } from "./use-model-icon";

export function ModelSelector({
  value,
  onChange,
  type = "all",
  className,
}: {
  value: ModelProps | null | undefined;
  onChange: (value: ModelProps) => void;
  type?: "all" | "language" | "embedding";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const { modelProviders, loading } = useModelProviders();
  const Icon = useModelIcon(value);

  const filterModel = (model: ModelProps) => {
    if (type === "embedding") {
      return model.id.includes("embedding");
    }
    if (type === "language") {
      return !model.id.includes("embedding");
    }
    return true;
  };

  return (
    <div>
      <Popover
        openPopover={open}
        setOpenPopover={setOpen}
        content={
          <Command loop className="w-[564px]">
            <CommandList className="h-[var(--cmdk-list-height)] max-h-[400px]">
              <CommandInput placeholder="搜索模型..." />
              <CommandEmpty className="flex h-[60px] items-center justify-center text-gray-500 text-sm">
                {loading ? <LoadingSpinner /> : "未找到结果"}
              </CommandEmpty>
              {(modelProviders || []).map((provider) => (
                <CommandGroup key={provider.name} heading={provider.name}>
                  {provider.models.filter(filterModel).map((model) => (
                    <ModelItem
                      key={model.id}
                      model={model}
                      isSelected={value?.id === model.id}
                      onSelect={() => {
                        onChange?.(model);
                        setOpen(false);
                      }}
                    />
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        }
      >
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a model"
          className={cn("h-8 w-full justify-between", className)}
          textWrapperClassName="w-full"
          text={
            <div className="flex items-center justify-between text-gray-500">
              {value ? (
                <div className="flex items-center">
                  {Icon && <Icon className="mt-0.5 mr-2 size-4 text-gray-700" />}
                  <span>{value.id}</span>
                </div>
              ) : (
                "选择模型..."
              )}
              <CaretSortIcon className="ml-2 size-4 shrink-0 opacity-50" />
            </div>
          }
        />
      </Popover>
    </div>
  );
}

interface ModelItemProps {
  model: ModelProps;
  isSelected: boolean;
  onSelect: () => void;
  onPeek?: (model: ModelProps) => void;
}

function ModelItem({ model, isSelected, onSelect, onPeek }: ModelItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = useModelIcon(model);

  useMutationObserver(ref, (mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        if (mutation.attributeName === "aria-selected") {
          onPeek?.(model);
        }
      }
    }
  });

  return (
    <CommandItem
      key={model.id}
      onSelect={onSelect}
      ref={ref}
      className="cursor-pointer aria-selected:bg-primary aria-selected:text-primary-foreground"
    >
      {Icon && <Icon className="mt-0.5 mr-2 size-4 text-gray-700" />}
      <span className="flex items-center">{model.id}</span>
      <CheckIcon className={cn("ml-auto h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
    </CommandItem>
  );
}
