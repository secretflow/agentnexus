import { Button } from "@/components/ui";
import { LayoutGrid } from "lucide-react";
import { toast } from "sonner";

export function LayoutTool() {
  const handleClick = () => {
    toast.info("该功能还在开发中，敬请期待！");
  };

  return (
    <Button
      text="整理"
      onClick={handleClick}
      className="px-2"
      variant="ghost"
      icon={<LayoutGrid className="size-4" />}
    />
  );
}
