import { useUpsertVariableModal } from "@/components/modals";
import { Badge, Label, Tooltip } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { VariableProps } from "@/lib/zod";
import { Pencil, Trash2 } from "lucide-react";

export function VariableList({
  variables,
  handleEdit,
  handleDelete,
  isEditable = true,
  isDeletable = true,
  className,
}: {
  variables: VariableProps[];
  handleEdit?: (name: string, variable: VariableProps) => boolean;
  handleDelete?: (name: string) => boolean;
  isEditable?: boolean;
  isDeletable?: boolean;
  className?: string;
}) {
  return (
    <ul className="space-y-1">
      {variables.map((item) => (
        <VariableItem
          className={className}
          variable={item}
          key={item.name}
          isEditable={isEditable}
          isDeletable={isDeletable}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ))}
    </ul>
  );
}

function VariableItem({
  variable,
  handleEdit,
  handleDelete,
  isEditable = true,
  isDeletable = true,
  className,
}: {
  variable: VariableProps;
  handleEdit?: (name: string, variable: VariableProps) => boolean;
  handleDelete?: (name: string) => boolean;
  isEditable?: boolean;
  isDeletable?: boolean;
  className?: string;
}) {
  const { setShowUpsertVariableModal, UpsertVariableModal } = useUpsertVariableModal({
    props: variable,
    onChange: (value) => {
      if (!(isEditable && handleEdit)) {
        return;
      }
      const result = handleEdit(variable.name, value);
      if (result) {
        setShowUpsertVariableModal(false);
      }
    },
  });

  return (
    <li
      className={cn(
        "group relative flex cursor-pointer items-center justify-between rounded-sm border px-2 py-1 text-gray-500",
        className,
      )}
    >
      <div className="mr-4 flex flex-grow items-center">
        <div className="flex items-center space-x-2">
          {variable.description ? (
            <Tooltip content={variable.description} side="left">
              <Label className="cursor-pointer font-medium text-sm">{variable.name}</Label>
            </Tooltip>
          ) : (
            <Label className="font-medium text-sm">{variable.name}</Label>
          )}
          <Badge variant="gray" className="rounded-md px-1 py-0 text-xs">
            {variable.type}
          </Badge>
          {variable.required && <Badge variant="default">Required</Badge>}
        </div>
      </div>
      <div className="flex space-x-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {isEditable && (
          <Pencil
            className="size-4 hover:text-gray-700"
            onClick={() => {
              setShowUpsertVariableModal(true);
            }}
          />
        )}
        {isDeletable && (
          <Trash2
            className="size-4 hover:text-gray-700"
            onClick={() => {
              if (isDeletable && handleDelete) {
                handleDelete(variable.name);
              }
            }}
          />
        )}
      </div>
      <UpsertVariableModal />
    </li>
  );
}
