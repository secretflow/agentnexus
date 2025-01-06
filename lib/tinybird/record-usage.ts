import { detectBot } from "@/lib/utils";

export async function recordUsage({
  req,
  appId,
  chatId,
  clientId,
  promptTokens,
  completionTokens,
  totalTokens,
}: {
  req: Request;
  appId: string;
  chatId: string;
  clientId: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}) {
  const isBot = detectBot(req);

  if (isBot) {
    return null;
  }

  const data = {
    timestamp: new Date(Date.now()).toISOString(),
    app_id: appId,
    chat_id: chatId,
    client_id: clientId,
    prompt_tokens: promptTokens,
    completion_tokens: completionTokens,
    total_tokens: totalTokens,
  };

  await fetch(`${process.env.TINYBIRD_API_URL}/v0/events?name=tokens_events&wait=true`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
    },
    body: JSON.stringify(data),
  });
}
