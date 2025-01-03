import { CHAT_API_KEY } from "@/lib/constants";
import { useLocalStorage } from "@/lib/hooks";
import { fetcher, fetcherWithApiKey } from "@/lib/utils";
import type { ChatAppProps, ChatMessageProps, ChatProps, VoteProps } from "@/lib/zod";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { useApplication } from "./application";

export function useChatApplication() {
  const { application } = useApplication();

  const {
    data: chatApplication,
    error,
    mutate,
  } = useSWR<ChatAppProps>(
    application &&
      `/api/applications/${application.id}/chatapp?workspaceId=${application.workspaceId}`,
    fetcher,
    {
      dedupingInterval: 60000,
    },
  );

  return {
    chatApplication,
    error,
    mutate,
    loading: application && !chatApplication && !error,
  };
}

export function useChatApp() {
  const { appId } = useParams<{ appId?: string }>();

  const {
    data: chatApp,
    error,
    mutate,
  } = useSWR<ChatAppProps>(appId && `/api/apps/${appId}`, fetcher, {
    dedupingInterval: 60000,
  });

  return {
    chatApp,
    error,
    mutate,
    loading: appId && !chatApp && !error,
  };
}

export function useChats() {
  const { appId } = useParams<{ appId?: string }>();
  const [apiKey] = useLocalStorage<string>(CHAT_API_KEY, "");

  const {
    data: chats,
    error,
    mutate,
  } = useSWR<ChatProps[]>(
    appId && apiKey && `/api/apps/${appId}/chats`,
    fetcherWithApiKey(apiKey),
    {
      dedupingInterval: 60000,
    },
  );

  return {
    chats,
    error,
    mutate,
    loading: appId && apiKey && !chats && !error,
  };
}

export function useChatInfo() {
  const { appId, chatId } = useParams<{ appId?: string; chatId?: string }>();
  const [apiKey] = useLocalStorage<string>(CHAT_API_KEY, "");

  const {
    data: chat,
    error,
    mutate,
  } = useSWR<ChatProps>(
    appId && chatId && apiKey && `/api/apps/${appId}/chats/${chatId}`,
    fetcherWithApiKey(apiKey),
    {
      dedupingInterval: 60000,
    },
  );

  return {
    chat,
    error,
    mutate,
    loading: appId && chatId && apiKey && !chat && !error,
  };
}

export function useChatMessages() {
  const { appId, chatId } = useParams<{ appId?: string; chatId?: string }>();
  const [apiKey] = useLocalStorage<string>(CHAT_API_KEY, "");

  const {
    data: messages,
    error,
    mutate,
  } = useSWR<ChatMessageProps[]>(
    appId && chatId && apiKey && `/api/apps/${appId}/chats/${chatId}/messages`,
    fetcherWithApiKey(apiKey),
    {
      dedupingInterval: 60000,
    },
  );

  return {
    messages,
    error,
    mutate,
    loading: appId && chatId && apiKey && !messages && !error,
  };
}

export function useChatVotes() {
  const { appId, chatId } = useParams<{ appId?: string; chatId?: string }>();
  const [apiKey] = useLocalStorage<string>(CHAT_API_KEY, "");

  const {
    data: votes,
    error,
    mutate,
  } = useSWR<VoteProps[]>(
    appId && chatId && apiKey && `/api/apps/${appId}/chats/${chatId}/votes`,
    fetcherWithApiKey(apiKey),
    {
      dedupingInterval: 60000,
    },
  );

  return {
    votes,
    error,
    mutate,
    loading: appId && chatId && apiKey && !votes && !error,
  };
}
