import { SidebarToggleIcon } from "@/components/icons";
import { Button, Tooltip, useSidebar } from "@/components/ui";

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Tooltip content="Toggle Sidebar" align="start">
      <Button
        onClick={toggleSidebar}
        variant="secondary"
        className="size-8 px-0"
        icon={<SidebarToggleIcon size={16} />}
      />
    </Tooltip>
  );
}
