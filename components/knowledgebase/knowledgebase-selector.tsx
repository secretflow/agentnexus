import { Book } from "@/components/icons";
import {
  Button,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import type { KnowledgebaseProps } from "@/lib/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export function KnowledgebaseSelector({
  knowledgebases,
  onSelect,
  className,
}: {
  knowledgebases: KnowledgebaseProps[];
  onSelect: (knowledgebase: KnowledgebaseProps) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Popover
        side="top"
        openPopover={open}
        setOpenPopover={setOpen}
        content={
          <Command loop>
            <CommandList className="h-[var(--cmdk-list-height)] max-h-[400px]">
              <CommandInput placeholder="搜索知识库..." />
              <CommandEmpty className="flex h-[60px] items-center justify-center text-gray-500 text-sm">
                未找到结果
              </CommandEmpty>
              {knowledgebases.map((knowledgebase) => (
                <KnowledgebaseItem
                  key={knowledgebase.id}
                  knowledgebase={knowledgebase}
                  onSelect={() => {
                    onSelect(knowledgebase);
                    setOpen(false);
                  }}
                />
              ))}
            </CommandList>
          </Command>
        }
      >
        <Button
          variant="secondary"
          className={cn("size-8 px-0", className)}
          onClick={() => {}}
          icon={<PlusIcon className="size-4 text-gray-500" />}
        />
      </Popover>
    </div>
  );
}

interface KnowledgebaseItemProps {
  knowledgebase: KnowledgebaseProps;
  onSelect: () => void;
}

function KnowledgebaseItem({ knowledgebase, onSelect }: KnowledgebaseItemProps) {
  return (
    <CommandItem
      key={knowledgebase.id}
      value={knowledgebase.id}
      onSelect={onSelect}
      className="cursor-pointer aria-selected:bg-primary aria-selected:text-primary-foreground"
    >
      <Book className="mr-2 h-4 w-4" />
      <span className="flex items-center">{knowledgebase.name}</span>
    </CommandItem>
  );
}
