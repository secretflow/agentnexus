import type { VariableRefGroup } from "@/components/workflow/variable";
import { VariableEditor } from "./editor";

export enum ChatMessageRole {
  System = "system",
  User = "user",
  Assistant = "assistant",
}

export function PromptEditor({
  role,
  defaultValue,
  onChange,
  availableVariableRefs,
  className,
}: {
  role: ChatMessageRole;
  defaultValue: string;
  onChange: (value: string) => void;
  availableVariableRefs: VariableRefGroup[];
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-1 text-gray-500 text-xs">{role}</div>
      <VariableEditor
        className="min-h-[100px] py-2"
        defaultValue={defaultValue}
        onChange={onChange}
        availableVariableRefs={availableVariableRefs}
      />
    </div>
  );
}
