import { Label, RadioGroup, RadioGroupItem } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import type { VariableType } from "@/lib/zod";
import { Hash, Text } from "lucide-react";

export const VARIABLE_CONFIGS: Record<
  VariableType,
  {
    text: string;
    active: boolean;
    icon: React.ElementType;
  }
> = {
  string: {
    text: "文本",
    active: true,
    icon: Text,
  },
  number: {
    text: "数字",
    active: true,
    icon: Hash,
  },
};

export function VariableTypeRadioSelector({
  value,
  onChange,
}: {
  value: VariableType;
  onChange: (value: VariableType) => void;
}) {
  return (
    <RadioGroup className="grid grid-cols-3 gap-4" value={value} onValueChange={onChange}>
      {Object.entries(VARIABLE_CONFIGS).map(([type, { active, text, icon: Icon }]) => (
        <div>
          <RadioGroupItem value={type} id={type} className="peer sr-only" disabled={!active} />
          <Label
            htmlFor={type}
            className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-disabled:hover:bg-white peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <Icon className="mb-3 size-6" />
            {text}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

export function VariableTypeSelector({
  value,
  onChange,
}: {
  value: VariableType;
  onChange: (value: VariableType) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a type" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(VARIABLE_CONFIGS).map(([type, { active, text, icon: Icon }]) => (
          <SelectItem key={type} value={type} disabled={!active} className="cursor-pointer">
            <div className="flex items-center space-x-2">
              <Icon className="size-4 text-gray-500" />
              <span>{text}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
