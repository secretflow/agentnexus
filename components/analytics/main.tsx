import { ChatsCard } from "./chats-card";
import { MessagesCard } from "./messages-card";
import { TimeseriesChart } from "./timeseries-chart";
import { UsersCard } from "./users-card";

export function Main() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <UsersCard />
        <ChatsCard />
        <MessagesCard />
      </div>
      <div className="pt-4">
        <TimeseriesChart />
      </div>
    </div>
  );
}
