import type { AnalyticsEvent } from "@/lib/zod";
import { Coins, MessageCircleMore, MessageSquareText, Users } from "lucide-react";

export const Analytics_EVENT_ATTR: Record<
  AnalyticsEvent,
  { title: string; description: string; icon: React.ElementType }
> = {
  users: {
    title: "用户数",
    description: "身份验证通过的用户数",
    icon: Users,
  },
  chats: {
    title: "会话数",
    description: "发起的会话轮数（包括已删除会话）",
    icon: MessageSquareText,
  },
  messages: {
    title: "消息数",
    description: "发送以和接收的消息总数",
    icon: MessageCircleMore,
  },
  tokens: {
    title: "Tokens",
    description: "消耗的 Tokens 总数",
    icon: Coins,
  },
};
