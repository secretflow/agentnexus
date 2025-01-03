"use client";

import { CircleXmark, Magnifier } from "@/components/icons";
import { cn } from "@/lib/utils";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { LoadingSpinner } from "./loading-spinner";

type SearchBoxProps = {
  value: string;
  loading?: boolean;
  showClearButton?: boolean;
  onChange: (value: string) => void;
  onChangeDebounced?: (value: string) => void;
  debounceTimeoutMs?: number;
  inputClassName?: string;
  placeholder?: string;
};

export const SearchBox = forwardRef(
  (
    {
      value,
      loading,
      showClearButton = true,
      onChange,
      onChangeDebounced,
      debounceTimeoutMs = 500,
      inputClassName,
      placeholder = "搜索...",
    }: SearchBoxProps,
    forwardedRef,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(forwardedRef, () => inputRef.current);

    const debounced = useDebouncedCallback(
      (value) => onChangeDebounced?.(value),
      debounceTimeoutMs,
    );

    const onKeyDown = useCallback((e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // only focus on filter input when:
      // - user is not typing in an input or textarea
      // - there is no existing modal backdrop (i.e. no other modal is open)
      if (e.key === "/" && target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }, []);

    useEffect(() => {
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [onKeyDown]);

    return (
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          {loading && value.length > 0 ? (
            <LoadingSpinner className="h-4 w-4" />
          ) : (
            <Magnifier className="size-4 text-gray-400" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          className={cn(
            "peer w-full rounded-md border border-gray-200 px-10 text-black outline-none placeholder:text-gray-400 sm:text-sm",
            "transition-all focus:border-gray-500 focus:ring-4 focus:ring-gray-200",
            inputClassName,
          )}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            debounced(e.target.value);
          }}
          autoCapitalize="none"
        />
        {showClearButton && value.length > 0 && (
          <button
            onClick={() => {
              onChange("");
              onChangeDebounced?.("");
            }}
            className="pointer-events-auto absolute inset-y-0 right-0 flex items-center pr-4"
          >
            <CircleXmark className="size-4 text-gray-600" />
          </button>
        )}
      </div>
    );
  },
);
