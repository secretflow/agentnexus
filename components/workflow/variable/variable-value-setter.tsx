"use client";

import { Button, Label, Textarea } from "@/components/ui";
import { useMediaQuery } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import type { VariableProps } from "@/lib/zod";
import { useForm } from "react-hook-form";
import type { VariableValue } from "./types";

export function VariableValueSetter({
  variables,
  onSuccess,
  className,
  variableValues,
}: {
  variables: VariableProps[];
  onSuccess?: (data: VariableValue) => void;
  className?: string;
  variableValues?: VariableValue;
}) {
  const { isMobile } = useMediaQuery();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<VariableValue>({
    defaultValues: variableValues,
  });

  const onSubmit = handleSubmit((data: VariableValue) => {
    onSuccess?.(data);
  });

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col space-y-4 text-left", className)}>
      {variables.map(({ name, required, maxLength, type }, index) => (
        <div key={name}>
          <Label htmlFor={name} className="flex items-center space-x-1 text-gray-700">
            {name}
            {required && <span className="text-red-600">*</span>}
          </Label>
          <div className="mt-2">
            <Textarea
              id={name}
              autoComplete="off"
              autoFocus={!isMobile && index === 0}
              placeholder={`请输入 ${name}`}
              {...register(name, {
                required: required,
                maxLength: maxLength,
                valueAsNumber: type === "number",
              })}
            />
            {errors[name] && <p className="mt-2 text-red-600 text-sm">{errors[name]!.message}</p>}
          </div>
        </div>
      ))}
      <Button loading={isSubmitting} disabled={isSubmitting} text="开始运行" className="h-8" />
    </form>
  );
}
