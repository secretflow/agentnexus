"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useCallback, useState } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const toggleIsPasswordVisible = useCallback(
      () => setIsPasswordVisible(!isPasswordVisible),
      [isPasswordVisible, setIsPasswordVisible],
    );

    return (
      <div>
        <div className="relative flex">
          <input
            type={isPasswordVisible ? "text" : type}
            className={cn(
              "w-full max-w-md rounded-md border border-input text-gray-900 placeholder-gray-400 focus:border-input focus:outline-none focus:ring-1 focus:ring-ring sm:text-sm",
              props.error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className,
            )}
            ref={ref}
            {...props}
          />

          <div className="group">
            {props.error && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex flex-none items-center px-2.5">
                <AlertCircle
                  className={cn(
                    "size-5 text-white",
                    type === "password" && "transition-opacity group-hover:opacity-0",
                  )}
                  fill="#ef4444"
                />
              </div>
            )}
            {type === "password" && (
              <button
                className={cn(
                  "absolute inset-y-0 right-0 flex items-center px-3",
                  props.error && "opacity-0 transition-opacity group-hover:opacity-100",
                )}
                type="button"
                onClick={() => toggleIsPasswordVisible()}
                aria-label={isPasswordVisible ? "Hide password" : "Show Password"}
              >
                {isPasswordVisible ? (
                  <EyeIcon
                    className="size-4 flex-none text-gray-500 transition hover:text-gray-700"
                    aria-hidden
                  />
                ) : (
                  <EyeOffIcon
                    className="size-4 flex-none text-gray-500 transition hover:text-gray-700"
                    aria-hidden
                  />
                )}
              </button>
            )}
          </div>
        </div>

        {props.error && (
          <span className="mt-2 block text-red-500 text-sm" role="alert" aria-live="assertive">
            {props.error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
