"use client";

import { useConfirmModal } from "@/components/modals";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui";
import { CHAT_API_KEY } from "@/lib/constants";
import { useLocalStorage } from "@/lib/hooks";
import { useChats } from "@/lib/swr";
import type { ChatProps } from "@/lib/zod";
import { isToday, isYesterday, subMonths, subWeeks } from "date-fns";
import { Ellipsis, Trash2 } from "lucide-react";
import { Link } from "next-view-transitions";
import { useParams, useRouter } from "next/navigation";
import { memo, useState } from "react";
import { toast } from "sonner";

type GroupedChats = {
  today: ChatProps[];
  yesterday: ChatProps[];
  lastWeek: ChatProps[];
  lastMonth: ChatProps[];
  older: ChatProps[];
};

const PureChatItem = ({
  appId,
  chat,
  isActive,
  onDelete,
  setOpenMobile,
}: {
  appId: string;
  chat: ChatProps;
  isActive: boolean;
  onDelete: (id: string) => void;
  setOpenMobile: (open: boolean) => void;
}) => (
  <SidebarMenuItem>
    <SidebarMenuButton asChild isActive={isActive}>
      <Link href={`/chat/${appId}/${chat.id}`} onClick={() => setOpenMobile(false)}>
        <span>{chat.title}</span>
      </Link>
    </SidebarMenuButton>
    <DropdownMenu modal={true}>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction
          className="mr-0.5 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          showOnHover={!isActive}
        >
          <Ellipsis />
          <span className="sr-only">更多</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500"
          onSelect={() => onDelete(chat.id)}
        >
          <Trash2 size={16} />
          <span>删除</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarMenuItem>
);

const ChatItem = memo(PureChatItem, (prevProps, nextProps) => {
  if (prevProps.isActive !== nextProps.isActive) return false;
  return true;
});

export function SidebarHistory() {
  const { setOpenMobile } = useSidebar();
  const [apiKey] = useLocalStorage<string>(CHAT_API_KEY, "");

  const router = useRouter();
  const { appId, chatId } = useParams<{ appId: string; chatId: string }>();
  const { chats: history, mutate, loading } = useChats();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { setShowConfirmModal, ConfirmModal } = useConfirmModal({
    title: "删除会话",
    content: "此操作无法撤销。这将永久删除您的聊天记录，是否继续？",
    onConfirm: () => {
      if (deleteId) {
        handleDelete(deleteId);
      }
    },
  });

  const handleDelete = (id: string) => {
    const deleteChat = fetch(`/api/apps/${appId}/chats/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    });

    toast.promise(deleteChat, {
      loading: "删除中...",
      success: () => {
        mutate(history?.filter((chat) => chat.id !== chatId));
        if (chatId === id) {
          router.push(`/chat/${appId}`);
        }
        return "删除成功！";
      },
      error: "删除失败！",
    });
  };

  if (loading) {
    return (
      <SidebarGroup>
        <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">今天</div>
        <SidebarGroupContent>
          <div className="flex flex-col">
            {[44, 32, 28, 64, 52].map((item) => (
              <div key={item} className="flex h-8 items-center gap-2 rounded-md px-2">
                <div
                  className="h-4 max-w-[--skeleton-width] flex-1 rounded-md bg-sidebar-accent-foreground/10"
                  style={
                    {
                      "--skeleton-width": `${item}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (history?.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="flex w-full flex-row items-center justify-center gap-2 text-sm text-zinc-500">
            <div>你的会话列表将会显示在这里</div>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  const groupChatsByDate = (chats: ChatProps[]): GroupedChats => {
    const now = new Date();
    const oneWeekAgo = subWeeks(now, 1);
    const oneMonthAgo = subMonths(now, 1);

    return chats.reduce(
      (groups, chat) => {
        const chatDate = new Date(chat.createdAt);

        if (isToday(chatDate)) {
          groups.today.push(chat);
        } else if (isYesterday(chatDate)) {
          groups.yesterday.push(chat);
        } else if (chatDate > oneWeekAgo) {
          groups.lastWeek.push(chat);
        } else if (chatDate > oneMonthAgo) {
          groups.lastMonth.push(chat);
        } else {
          groups.older.push(chat);
        }

        return groups;
      },
      {
        today: [],
        yesterday: [],
        lastWeek: [],
        lastMonth: [],
        older: [],
      } as GroupedChats,
    );
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {history &&
              (() => {
                const groupedChats = groupChatsByDate(history);

                return (
                  <>
                    {groupedChats.today.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">Today</div>
                        {groupedChats.today.map((chat) => (
                          <ChatItem
                            key={chat.id}
                            appId={appId}
                            chat={chat}
                            isActive={chat.id === chatId}
                            onDelete={(id) => {
                              setDeleteId(id);
                              setShowConfirmModal(true);
                            }}
                            setOpenMobile={setOpenMobile}
                          />
                        ))}
                      </>
                    )}

                    {groupedChats.yesterday.length > 0 && (
                      <>
                        <div className="mt-6 px-2 py-1 text-sidebar-foreground/50 text-xs">
                          Yesterday
                        </div>
                        {groupedChats.yesterday.map((chat) => (
                          <ChatItem
                            appId={appId}
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === chatId}
                            onDelete={(id) => {
                              setDeleteId(id);
                              setShowConfirmModal(true);
                            }}
                            setOpenMobile={setOpenMobile}
                          />
                        ))}
                      </>
                    )}

                    {groupedChats.lastWeek.length > 0 && (
                      <>
                        <div className="mt-6 px-2 py-1 text-sidebar-foreground/50 text-xs">
                          Last 7 days
                        </div>
                        {groupedChats.lastWeek.map((chat) => (
                          <ChatItem
                            appId={appId}
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === chatId}
                            onDelete={(id) => {
                              setDeleteId(id);
                              setShowConfirmModal(true);
                            }}
                            setOpenMobile={setOpenMobile}
                          />
                        ))}
                      </>
                    )}

                    {groupedChats.lastMonth.length > 0 && (
                      <>
                        <div className="mt-6 px-2 py-1 text-sidebar-foreground/50 text-xs">
                          Last 30 days
                        </div>
                        {groupedChats.lastMonth.map((chat) => (
                          <ChatItem
                            appId={appId}
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === chatId}
                            onDelete={(id) => {
                              setDeleteId(id);
                              setShowConfirmModal(true);
                            }}
                            setOpenMobile={setOpenMobile}
                          />
                        ))}
                      </>
                    )}

                    {groupedChats.older.length > 0 && (
                      <>
                        <div className="mt-6 px-2 py-1 text-sidebar-foreground/50 text-xs">
                          Older
                        </div>
                        {groupedChats.older.map((chat) => (
                          <ChatItem
                            appId={appId}
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === chatId}
                            onDelete={(id) => {
                              setDeleteId(id);
                              setShowConfirmModal(true);
                            }}
                            setOpenMobile={setOpenMobile}
                          />
                        ))}
                      </>
                    )}
                  </>
                );
              })()}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <ConfirmModal />
    </>
  );
}
