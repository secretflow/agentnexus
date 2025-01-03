import { cn } from "@/lib/utils";
import { LayoutGroup, motion } from "framer-motion";
import { useId } from "react";

interface ToggleOption {
  value: string;
  label: string;
  badge?: React.ReactNode;
}

export function ToggleGroup({
  options,
  selected,
  selectAction,
  className,
  style,
}: {
  options: ToggleOption[];
  selected: string | null;
  selectAction: (option: string) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const layoutGroupId = useId();

  return (
    <LayoutGroup id={layoutGroupId}>
      <motion.div
        layout
        className={cn(
          "relative inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1",
          className,
        )}
        style={style}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={cn(
              "relative z-10 flex items-center gap-2 px-3 py-1 font-medium text-sm capitalize",
              {
                "transition-all hover:text-gray-500": option.value !== selected,
              },
            )}
            onClick={() => selectAction(option.value)}
          >
            <p>{option.label}</p>
            {option.badge}
            {option.value === selected && (
              <motion.div
                layoutId={layoutGroupId}
                className="-z-[1] absolute top-0 left-0 h-full w-full rounded-lg border border-gray-200 bg-gray-50"
                transition={{ duration: 0.25 }}
              />
            )}
          </button>
        ))}
      </motion.div>
    </LayoutGroup>
  );
}
