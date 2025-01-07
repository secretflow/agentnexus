import { Textarea } from "@/components/ui";

export function PromptForm({
  value,
  onValueChange,
}: {
  value: string | undefined | null;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="relative flex flex-col space-y-4 px-6 py-4">
      <div className="flex flex-col space-y-3">
        <h2 className="font-medium text-xl">提示词</h2>
        <p className="text-gray-500 text-sm">对 AI 发出指令或者约束</p>
      </div>
      <Textarea rows={4} defaultValue={value || ""} onBlur={(e) => onValueChange(e.target.value)} />
    </div>
  );
}
