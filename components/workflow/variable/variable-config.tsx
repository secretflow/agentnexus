import { useUpsertVariableModal } from "@/components/modals";
import { Button } from "@/components/ui";
import type { VariableProps } from "@/lib/zod";
import { PlusCircleIcon } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { VariableList } from "./variable-list";

export function VariableConfig({
  variables,
  onVariablesChange,
  isAddable = true,
  isEditable = true,
  isDeletable = true,
}: {
  variables: VariableProps[];
  onVariablesChange: (variables: VariableProps[]) => void;
  isAddable?: boolean;
  isEditable?: boolean;
  isDeletable?: boolean;
}) {
  const isDuplicateName = useCallback(
    (name: string) => {
      return !!variables.find((v) => v.name === name);
    },
    [variables],
  );

  const { setShowUpsertVariableModal, UpsertVariableModal } = useUpsertVariableModal({
    onChange: (variable) => {
      if (isDuplicateName(variable.name)) {
        toast.info("变量已存在, 请修改变量名");
        return;
      }
      onVariablesChange(variables.concat(variable));
      setShowUpsertVariableModal(false);
    },
  });

  return (
    <div>
      <VariableList
        variables={variables}
        isEditable={isEditable}
        isDeletable={isDeletable}
        handleDelete={(name) => {
          if (!isDeletable) {
            return false;
          }
          onVariablesChange(variables.filter((v) => v.name !== name));
          return true;
        }}
        handleEdit={(name, variable) => {
          if (!isEditable) {
            return false;
          }

          if (variable.name === name) {
            onVariablesChange(variables.map((v) => (v.name === name ? variable : v)));
          } else {
            if (isDuplicateName(variable.name)) {
              toast.info("变量已存在, 请修改变量名");
              return false;
            } else {
              const newVariables = [...variables];
              const index = newVariables.findIndex((v) => v.name === name);
              newVariables[index] = variable;
              onVariablesChange(newVariables);
            }
          }
          return true;
        }}
      />
      {isAddable && (
        <Button
          variant="secondary"
          className="mt-2 h-8 border-dashed text-sm"
          icon={<PlusCircleIcon className="h-4 w-4" />}
          text="添加变量"
          onClick={() => setShowUpsertVariableModal(true)}
        />
      )}
      <UpsertVariableModal />
    </div>
  );
}
