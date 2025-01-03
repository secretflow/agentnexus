import { Button } from "@/components/ui";
import { CirclePlay } from "lucide-react";
import { useContext } from "react";
import { GraphContext } from "../graph-provider";

export function RunTool() {
  const { setConsolePanelOpen } = useContext(GraphContext);

  const handleClick = () => {
    setConsolePanelOpen(true);
  };

  return (
    <Button
      text="运行"
      onClick={handleClick}
      className="px-2"
      variant="ghost"
      icon={<CirclePlay className="size-4" />}
    />
  );
}
