import { detectBot } from "@/lib/utils";

export async function recordChat({
  req,
  appId,
  chatId,
  clientId,
}: {
  req: Request;
  appId: string;
  chatId: string;
  clientId: string;
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
  };

  await fetch(`${process.env.TINYBIRD_API_URL}/v0/events?name=chats_events&wait=true`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
    },
    body: JSON.stringify(data),
  });
}
