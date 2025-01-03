import { detectBot } from "@/lib/utils";

export async function recordMessages(
  req: Request,
  messages: Array<{
    appId: string;
    clientId: string;
    chatId: string;
    messageId: string;
    role: string;
  }>,
) {
  const isBot = detectBot(req);

  if (isBot) {
    return null;
  }

  const data = messages.map(({ appId, clientId, chatId, messageId, role }) => ({
    timestamp: new Date(Date.now()).toISOString(),
    app_id: appId,
    client_id: clientId,
    chat_id: chatId,
    message_id: messageId,
    role,
  }));

  await fetch(`${process.env.TINYBIRD_API_URL}/v0/events?name=messages_events&wait=true`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
    },
    body: data.map((item) => JSON.stringify(item)).join("\n"),
  });
}

export async function recordMessageVote(req: Request, messageId: string, vote: "up" | "down") {
  const isBot = detectBot(req);

  if (isBot) {
    return null;
  }

  const data = {
    timestamp: new Date(Date.now()).toISOString(),
    message_id: messageId,
    vote,
  };

  await fetch(`${process.env.TINYBIRD_API_URL}/v0/events?name=message_votes_events&wait=true`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
    },
    body: JSON.stringify(data),
  });
}
