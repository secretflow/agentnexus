import { type VariableRefGroup, VariableRefPanel } from "@/components/workflow/variable";
import { cn } from "@/lib/utils";
import { createElement, useEffect, useRef, useState } from "react";
import { type Root, createRoot } from "react-dom/client";
import tippy from "tippy.js";
import { useDebouncedCallback } from "use-debounce";
import {
  formatVariableValue,
  insertVariableRefAtCaret,
  moveCaretToEnd,
  parseVariableValue,
} from "./util";

export function VariableEditor({
  defaultValue,
  onChange,
  availableVariableRefs,
  className,
}: {
  defaultValue: string;
  onChange: (value: string) => void;
  availableVariableRefs: VariableRefGroup[];
  className?: string;
}) {
  const rootRef = useRef<Root>();
  const ref = useRef<HTMLDivElement>(null);
  const [editorFocused, setEditorFocused] = useState(false);

  useEffect(() => {
    // If the editor is focused, don't update the value
    // otherwise the user will lose their cursor position
    if (!ref.current || editorFocused) return;
    ref.current.innerHTML = parseVariableValue(defaultValue, availableVariableRefs);
  }, [availableVariableRefs, editorFocused]);

  const handleSlashCommand = () => {
    if (!ref.current) return;

    tippy(ref.current, {
      appendTo: () => ref.current!,
      showOnCreate: true,
      interactive: true,
      trigger: "manual",
      placement: "bottom-start",
      content: "<div id='variable-editor-anchor' class='-mx-[9px] -my-[5px]'></div>",
      allowHTML: true,
      theme: "light",
      arrow: false,
      onMount(instance) {
        const anchor = instance.popper.querySelector("#variable-editor-anchor");
        if (anchor) {
          rootRef.current = createRoot(anchor);
          rootRef.current.render(
            createElement(VariableRefPanel, {
              className: "w-[350px]",
              availableVariableRefs,
              value: null,
              onChange: (val) => {
                if (val) {
                  const nodeTitle =
                    availableVariableRefs.find((group) => group.nodeId === val.nodeId)?.title ?? "";
                  moveCaretToEnd(ref.current!);
                  insertVariableRefAtCaret({
                    nodeId: val.nodeId,
                    nodeTitle,
                    variable: val.variable,
                  });
                  debouncedOnChange();
                }
                instance.hide();
              },
            }),
          );
        }
      },
      onHide() {
        if (rootRef.current) {
          rootRef.current.unmount();
          rootRef.current = undefined;
        }
      },
    });
  };

  const debouncedOnChange = useDebouncedCallback(() => {
    onChange(formatVariableValue(ref.current!));
  }, 200);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "/") {
      e.preventDefault();
      handleSlashCommand();
    } else {
      debouncedOnChange();
    }
  };

  return (
    <div
      ref={ref}
      data-placeholder="使用 / 引用变量"
      contentEditable
      onFocus={() => setEditorFocused(true)}
      onKeyDown={handleKeyDown}
      className={cn(
        "variable-editor min-h-8 w-full max-w-md rounded-md border border-input px-3 py-1 text-gray-900 placeholder-gray-400 focus:border-input focus:outline-none focus:ring-1 focus:ring-ring sm:text-sm",
        className,
      )}
    />
  );
}
