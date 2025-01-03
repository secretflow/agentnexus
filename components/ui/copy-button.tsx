"use client";

import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { Check, Copy, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const copyButtonVariants = cva("relative group rounded-full p-1.5 transition-all duration-75", {
  variants: {
    variant: {
      default:
        "bg-gray-100 hover:scale-105 hover:bg-blue-100 active:scale-95 text-gray-700 hover:text-blue-800",
      neutral: "bg-transparent hover:bg-gray-100 active:bg-gray-200",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function CopyButton({
  variant = "default",
  value,
  className,
  icon,
}: {
  value: string;
  className?: string;
  icon?: LucideIcon;
} & VariantProps<typeof copyButtonVariants>) {
  const [copied, setCopied] = useState(false);
  const Comp = icon || Copy;
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setCopied(true);
        navigator.clipboard.writeText(value).then(() => {
          toast.success("已复制到剪贴板！");
        });
        setTimeout(() => setCopied(false), 3000);
      }}
      className={cn(copyButtonVariants({ variant }), className)}
    >
      <span className="sr-only">Copy</span>
      {copied ? <Check className="h-3.5 w-3.5" /> : <Comp className="h-3.5 w-3.5" />}
    </button>
  );
}
