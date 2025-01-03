import { Button, Tooltip } from "@/components/ui";
import { getMessageIdFromAnnotations } from "@/lib/ai";
import { CHAT_API_KEY } from "@/lib/constants";
import { useCopyToClipboard } from "@/lib/hooks";
import { useLocalStorage } from "@/lib/hooks";
import type { VoteProps } from "@/lib/zod";
import type { Message } from "ai";
import equal from "fast-deep-equal";
import { Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { memo } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

function PureMessageActions({
  appId,
  chatId,
  message,
  vote,
  isLoading,
}: {
  appId: string;
  chatId: string;
  message: Message;
  vote: VoteProps | undefined;
  isLoading: boolean;
}) {
  const [apiKey] = useLocalStorage<string>(CHAT_API_KEY, "");
  const { mutate } = useSWRConfig();
  const [_, copyToClipboard] = useCopyToClipboard();

  const handleVote = async (isUpvoted: boolean) => {
    const messageId = getMessageIdFromAnnotations(message);

    fetch(`/api/apps/${appId}/chats/${chatId}/votes`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ chatId, messageId, isUpvoted }),
    }).then(async (res) => {
      if (res.ok) {
        toast.success(isUpvoted ? "点赞成功！" : "点踩成功！");
        mutate<VoteProps[]>(
          `/api/apps/${appId}/chats/${chatId}/votes`,
          (currentVotes) => {
            if (!currentVotes) return [];
            const votesWithoutCurrent = currentVotes.filter(
              (vote) => vote.messageId !== message.id,
            );

            return [
              ...votesWithoutCurrent,
              {
                chatId,
                messageId: message.id,
                isUpvoted,
              },
            ];
          },
          { revalidate: false },
        );
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    });
  };

  if (isLoading) return null;
  if (message.role === "user") return null;
  if (message.toolInvocations && message.toolInvocations.length > 0) return null;

  return (
    <div className="flex flex-row gap-2">
      <Tooltip content="复制">
        <Button
          className="h-7 w-8 px-2 py-1 text-muted-foreground"
          variant="secondary"
          icon={<Copy />}
          onClick={async () => {
            await copyToClipboard(message.content as string);
            toast.success("复制成功!");
          }}
        />
      </Tooltip>

      <Tooltip content="点赞">
        <Button
          icon={<ThumbsUp />}
          className="!pointer-events-auto h-7 w-8 px-2 py-1 text-muted-foreground"
          disabled={vote?.isUpvoted}
          variant="secondary"
          onClick={() => handleVote(true)}
        />
      </Tooltip>

      <Tooltip content="点踩">
        <Button
          icon={<ThumbsDown />}
          className="!pointer-events-auto h-7 w-8 px-2 py-1 text-muted-foreground"
          variant="secondary"
          disabled={vote && !vote.isUpvoted}
          onClick={() => handleVote(false)}
        />
      </Tooltip>
    </div>
  );
}

export const MessageActions = memo(PureMessageActions, (prevProps, nextProps) => {
  if (!equal(prevProps.vote, nextProps.vote)) return false;
  if (prevProps.isLoading !== nextProps.isLoading) return false;

  return true;
});
