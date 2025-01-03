import { Button, Modal, Popover, TabSelect } from "@/components/ui";
import { useMediaQuery } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import type { AnalyticsEvent } from "@/lib/zod";
import { ChevronsUpDown } from "lucide-react";
import { type Dispatch, type ReactNode, type SetStateAction, useContext, useState } from "react";
import { Analytics_EVENT_ATTR } from "./constant";
import { AnalyticsContext } from "./provider";

export function AnalyticsCard<T extends string>({
  tabs,
  selectedTabId,
  onSelectTab,
  expandLimit,
  hasMore,
  children,
  className,
}: {
  tabs: { id: T; label: string; icon: React.ElementType }[];
  selectedTabId: T;
  onSelectTab?: Dispatch<SetStateAction<T>> | ((tabId: T) => void);
  expandLimit: number;
  hasMore?: boolean;
  children: (props: {
    limit?: number;
    eventType?: AnalyticsEvent;
    setShowModal: (show: boolean) => void;
  }) => ReactNode;
  className?: string;
}) {
  const { eventType } = useContext(AnalyticsContext);
  const { title, icon: Icon } = Analytics_EVENT_ATTR[eventType];

  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const selectedTab = tabs.find(({ id }) => id === selectedTabId) || tabs[0];
  const SelectedTabIcon = selectedTab.icon;
  const { isMobile } = useMediaQuery();

  return (
    <>
      <Modal showModal={showModal} setShowModal={setShowModal} className="max-w-lg px-0">
        <div className="border-gray-200 border-b px-6 py-4">
          <h1 className="font-semibold text-lg">{selectedTab?.label}</h1>
        </div>
        {children({ setShowModal, eventType })}
      </Modal>
      <div
        className={cn(
          "relative z-0 h-[400px] overflow-hidden border border-gray-200 bg-white sm:rounded-xl",
          className,
        )}
      >
        <div className="flex items-center justify-between border-gray-200 border-b px-4">
          {/* Main tabs */}
          {isMobile ? (
            <Popover
              openPopover={isOpen}
              setOpenPopover={setIsOpen}
              content={
                <div className="grid w-full gap-px p-2 sm:w-48">
                  {tabs.map(({ id, label, icon: Icon }) => (
                    <Button
                      key={id}
                      text={label}
                      variant="ghost"
                      onClick={() => {
                        onSelectTab?.(id);
                        setIsOpen(false);
                      }}
                      icon={<Icon className="size-4" />}
                      className={cn(
                        "h-9 w-full justify-start px-2 font-medium",
                        selectedTabId === id && "bg-gray-100",
                      )}
                    />
                  ))}
                </div>
              }
              align="end"
            >
              <Button
                type="button"
                className="my-2 h-8 w-fit whitespace-nowrap px-2"
                variant="ghost"
                icon={<SelectedTabIcon className="size-4" />}
                text={selectedTab.label}
                right={
                  <ChevronsUpDown className="size-4 shrink-0 text-gray-400" aria-hidden="true" />
                }
              />
            </Popover>
          ) : (
            <TabSelect options={tabs} selected={selectedTabId} onSelect={onSelectTab} />
          )}

          <div className="flex items-center gap-1 pr-2 text-gray-500">
            <Icon className="hidden h-4 w-4 sm:block" />
            <p className="text-xs uppercase">{title}</p>
          </div>
        </div>
        <div className="py-4">{children({ limit: expandLimit, eventType, setShowModal })}</div>
        {hasMore && (
          <div className="absolute bottom-0 left-0 z-10 flex w-full items-end">
            <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-full bg-gradient-to-t from-white" />
            <button
              onClick={() => setShowModal(true)}
              className="group relative flex w-full items-center justify-center py-4"
            >
              <div className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-gray-950 text-sm group-hover:bg-gray-100 group-active:border-gray-300">
                查看所有
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
