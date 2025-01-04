import { Badge, Label, RadioGroup, RadioGroupItem, ToggleGroup, Tooltip } from "@/components/ui";
import type { ApplicationType } from "@/lib/zod";
import { Bot, Workflow } from "lucide-react";

export const APPLICATION_CONFIGS: Record<
  ApplicationType,
  {
    color: "sky" | "violet" | "rainbow";
    text: string;
    description: string;
    active: boolean;
    icon: React.ElementType;
  }
> = {
  agent: {
    color: "rainbow",
    text: "Agent",
    description: "构建可以自主选择工具完成任务的智能 Agent",
    active: true,
    icon: Bot,
  },
  workflow: {
    color: "sky",
    text: "工作流",
    description: "以工作流的形式编排大模型应用",
    active: true,
    icon: Workflow,
  },
};

export function ApplicationTypeBadge({ type }: { type: ApplicationType }) {
  return <Badge variant={APPLICATION_CONFIGS[type].color}>{APPLICATION_CONFIGS[type].text}</Badge>;
}

export function ApplicationTypeRadioSelector({
  value,
  onChange,
}: {
  value: ApplicationType;
  onChange: (value: ApplicationType) => void;
}) {
  return (
    <RadioGroup className="grid grid-cols-3 gap-4" value={value} onValueChange={onChange}>
      {Object.entries(APPLICATION_CONFIGS).map(
        ([type, { description, active, text, icon: Icon }]) => (
          <Tooltip key={type} content={description}>
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
          </Tooltip>
        ),
      )}
    </RadioGroup>
  );
}

export type ApplicationTypeOrAll = ApplicationType | "all";

export function ApplicationTypeToggle({
  value,
  onChange,
}: {
  value: ApplicationTypeOrAll;
  onChange: (value: ApplicationTypeOrAll) => void;
}) {
  return (
    <ToggleGroup
      options={Object.entries({ all: { text: "所有" }, ...APPLICATION_CONFIGS }).map(
        ([type, config]) => ({
          value: type,
          label: config.text,
        }),
      )}
      selected={value}
      selectAction={(t) => onChange(t as ApplicationTypeOrAll)}
    />
  );
}
