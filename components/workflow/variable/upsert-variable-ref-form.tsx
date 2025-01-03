import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { VariableRefProps } from "@/lib/zod";
import { Trash2 } from "lucide-react";
import { PlusCircleIcon } from "lucide-react";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import type { VariableRefGroup } from "./types";
import {} from "./use-variable-refs";
import { VariableRefSelector } from "./variable-ref-selector";

type FormData = {
  variableRefs: VariableRefProps[];
};

export function UpsertVariableRefForm({
  variableRefs,
  onValueChange,
  availableVariableRefs,
  className,
}: {
  variableRefs: VariableRefProps[];
  onValueChange: (data: FormData) => void;
  availableVariableRefs: VariableRefGroup[];
  className?: string;
}) {
  const {
    watch,
    control,
    register,
    handleSubmit,
    // formState: { isSubmitting, errors },
  } = useForm<FormData>({
    defaultValues: {
      variableRefs: variableRefs.length ? variableRefs : [{ name: "", ref: null }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "variableRefs",
    control: control,
  });

  const onSubmit = handleSubmit(async (data) => {
    onValueChange?.(data);
  });

  useEffect(() => {
    const subscription = watch(() => onSubmit());
    return () => subscription.unsubscribe();
  }, [handleSubmit, watch]);

  return (
    <form className={cn("flex flex-col gap-8 text-left", className)}>
      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <div key={field.id} className="relative">
            <label>
              <div className="relative flex w-[316px] rounded-md">
                <Input
                  placeholder="变量名称"
                  autoComplete="off"
                  className="h-8 w-[90px]"
                  {...register(`variableRefs.${index}.name`, {
                    required: index === 0,
                  })}
                />
                <div className="ml-2 w-[220px]">
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <VariableRefSelector
                        availableVariableRefs={availableVariableRefs}
                        value={value}
                        onChange={onChange}
                      />
                    )}
                    name={`variableRefs.${index}.ref`}
                  />
                </div>
              </div>
            </label>
            {index > 0 && (
              <div className="-translate-y-1/2 absolute top-1/2 right-0">
                <Button
                  variant="ghost"
                  icon={<Trash2 className="size-4" />}
                  className="h-8 px-1"
                  onClick={() => remove(index)}
                />
              </div>
            )}
          </div>
        ))}
        <Button
          variant="secondary"
          className="mt-2 h-8 border-dashed"
          icon={<PlusCircleIcon className="h-4 w-4" />}
          text="添加变量"
          onClick={() => append({ name: "", ref: null })}
        />
      </div>
    </form>
  );
}
