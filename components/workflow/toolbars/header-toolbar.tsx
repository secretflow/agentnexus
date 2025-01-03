import { LayoutTool } from "./layout";
import { PublishTool } from "./publish";
import { RemoveTool } from "./remove";
import { RunTool } from "./run";
import { SelectionTool } from "./selection";

export function HeaderToolbars() {
  return (
    <div className="-translate-x-[50%] absolute top-4 left-[50%] flex h-12 items-center rounded-md border bg-white p-1 shadow-sm">
      <LayoutTool />
      <SelectionTool />
      <RemoveTool />
      <RunTool />
      <PublishTool />
    </div>
  );
}
