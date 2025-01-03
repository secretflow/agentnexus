import { Chat } from "@/components/chat";
import { uuid } from "@/lib/utils";

export default function ChatAppPage() {
  const id = uuid();

  return <Chat id={id} initialMessages={[]} />;
}
