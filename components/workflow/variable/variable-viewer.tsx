import { cn } from "@/lib/utils";
import type { VariableViewProps } from "./types";

export function VariableViewer({
  variables,
  className,
}: {
  variables: VariableViewProps[];
  showValue?: boolean;
  className?: string;
}) {
  return (
    <ul className="space-y-1">
      {variables.map(({ name, value, icon }) => (
        <VariableItem key={name} name={name} value={value} icon={icon} className={className} />
      ))}
    </ul>
  );
}

function VariableItem({
  name,
  value,
  icon: Icon,
  className,
}: {
  name: string;
  value?: string | number;
  icon?: React.ElementType;
  className?: string;
}) {
  return (
    <li
      className={cn(
        "group relative flex cursor-pointer items-center justify-between rounded-sm border px-2 py-1 text-gray-500",
        className,
      )}
    >
      <div className="flex items-center gap-2 font-medium text-sm">
        {Icon && <Icon className="size-4" />}
        <span>{name}</span>
      </div>
      {value !== undefined && <div className="font-medium text-sm">{value}</div>}
    </li>
  );
}
