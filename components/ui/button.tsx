import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { type ReactNode, forwardRef } from "react";
import { LoadingSpinner } from "./loading-spinner";
import { Tooltip } from "./tooltip";

export const buttonVariants = cva("transition-all", {
  variants: {
    variant: {
      primary:
        "border-black bg-black text-white hover:bg-gray-800 hover:ring-4 hover:ring-gray-200",
      secondary: cn(
        "border-gray-200 bg-white text-gray-900 hover:bg-gray-50 focus-visible:border-gray-500 outline-none",
        "data-[state=open]:border-gray-500 data-[state=open]:ring-4 data-[state=open]:ring-gray-200",
      ),
      ghost: "border-transparent text-neutral-600 hover:bg-neutral-100",
      success:
        "border-blue-500 bg-blue-500 text-white hover:bg-blue-600 hover:ring-4 hover:ring-blue-100",
      danger:
        "border-red-500 bg-red-500 text-white hover:bg-red-600 hover:ring-4 hover:ring-red-100",
      "danger-ghost": "border-transparent bg-white text-red-500 hover:bg-red-600 hover:text-white",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  text?: ReactNode | string;
  textWrapperClassName?: string;
  loading?: boolean;
  icon?: ReactNode;
  shortcut?: string;
  right?: ReactNode;
  disabledTooltip?: string | ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      text,
      variant = "primary",
      className,
      textWrapperClassName,
      loading,
      icon,
      shortcut,
      right,
      disabledTooltip,
      ...props
    }: ButtonProps,
    forwardedRef,
  ) => {
    if (disabledTooltip) {
      return (
        <Tooltip content={disabledTooltip}>
          <div
            className={cn(
              "flex h-10 w-full cursor-not-allowed items-center justify-center gap-x-2 rounded-md border border-gray-200 bg-gray-100 px-4 text-gray-400 text-sm transition-all focus:outline-none",
              {
                "border-transparent bg-transparent": variant?.endsWith("ghost"),
              },
              className,
            )}
          >
            {icon}
            {text && (
              <div
                className={cn(
                  "min-w-0 truncate",
                  shortcut && "flex-1 text-left",
                  textWrapperClassName,
                )}
              >
                {text}
              </div>
            )}
            {shortcut && (
              <kbd
                className={cn(
                  "hidden rounded bg-gray-200 px-2 py-0.5 font-light text-gray-400 text-xs md:inline-block",
                  {
                    "bg-gray-100": variant?.endsWith("ghost"),
                  },
                )}
              >
                {shortcut}
              </kbd>
            )}
          </div>
        </Tooltip>
      );
    }
    return (
      <button
        ref={forwardedRef}
        // if onClick is passed, it's a "button" type, otherwise it's being used in a form, hence "submit"
        type={props.onClick ? "button" : "submit"}
        className={cn(
          "group flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border px-4 text-sm",
          props.disabled || loading
            ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 outline-none"
            : buttonVariants({ variant }),
          className,
        )}
        disabled={props.disabled || loading}
        {...props}
      >
        {loading ? <LoadingSpinner /> : icon ? icon : null}
        {text && (
          <div
            className={cn("min-w-0 truncate", shortcut && "flex-1 text-left", textWrapperClassName)}
          >
            {text}
          </div>
        )}
        {shortcut && (
          <kbd
            className={cn(
              "hidden rounded px-2 py-0.5 font-light text-xs transition-all duration-75 md:inline-block",
              {
                "bg-gray-700 text-gray-400 group-hover:bg-gray-600 group-hover:text-gray-300":
                  variant === "primary",
                "bg-gray-200 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-500":
                  variant === "secondary",
                "bg-gray-100 text-gray-500 group-hover:bg-gray-200": variant === "ghost",
                "bg-red-100 text-red-600 group-hover:bg-red-500 group-hover:text-white":
                  variant === "danger-ghost",
              },
            )}
          >
            {shortcut}
          </kbd>
        )}
        {right}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
