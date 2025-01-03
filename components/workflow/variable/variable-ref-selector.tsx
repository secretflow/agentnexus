import { Slash } from "@/components/icons";
import { Button, Popover } from "@/components/ui";
import type { VariableRefProps } from "@/lib/zod";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";
import type { VariableRefGroup } from "./types";
import { VariableRefPanel } from "./variable-ref-panel";

export function VariableRefSelector({
  value,
  onChange,
  availableVariableRefs,
}: {
  value: VariableRefProps["ref"];
  onChange: (value: VariableRefProps["ref"]) => void;
  availableVariableRefs: VariableRefGroup[];
}) {
  const [open, setOpen] = useState(false);

  const selectedValue = useMemo(() => {
    if (!value) {
      return null;
    }

    const { nodeId, variable } = value;
    const node = availableVariableRefs.find((v) => v.nodeId === nodeId);
    if (!node) {
      return null;
    }

    const variableItem = node.variables.find((v) => v.name === variable);
    if (!variableItem) {
      return null;
    }

    return {
      title: node.title,
      icon: node.icon,
      variable: variableItem,
    };
  }, [value, availableVariableRefs]);

  return (
    <div>
      <Popover
        openPopover={open}
        setOpenPopover={setOpen}
        content={
          <VariableRefPanel
            availableVariableRefs={availableVariableRefs}
            value={value}
            onChange={(val) => {
              onChange(val);
              setOpen(false);
            }}
          />
        }
      >
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a model"
          className="h-8 w-full justify-between"
          textWrapperClassName="w-full"
          text={
            <div className="flex items-center justify-between text-gray-700">
              {selectedValue ? (
                <div className="flex items-center space-x-1 text-xs">
                  <selectedValue.icon className="size-4 text-gray-500" />
                  <span>{selectedValue.title}</span>
                  <Slash />
                  <span>{selectedValue.variable.name}</span>
                  {/* <Badge variant="gray" className="rounded-md px-1">
                    {selectedValue.variable.type}
                  </Badge> */}
                </div>
              ) : (
                "选择变量..."
              )}
              <CaretSortIcon className="ml-2 size-4 shrink-0 opacity-50" />
            </div>
          }
        />
      </Popover>
    </div>
  );
}
