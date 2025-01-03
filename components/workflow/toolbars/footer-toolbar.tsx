import {
  Button,
  Command,
  CommandItem,
  CommandList,
  CommandSeparator,
  Popover,
} from "@/components/ui";
import { useGraphEvent, useGraphInstance } from "@antv/xflow";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useState } from "react";

export function FooterToolbars() {
  const graph = useGraphInstance();
  const [openPopover, setOpenPopover] = useState(false);
  const [scale, setScale] = useState(1);

  useGraphEvent("scale", ({ sx }) => {
    setScale(sx);
  });

  const zoomIn = useCallback(() => {
    if (graph && scale < 1.5) {
      graph.zoom(0.25);
    }
  }, [graph, scale]);

  const zoomOut = useCallback(() => {
    if (graph && scale > 0.5) {
      graph.zoom(-0.25);
    }
  }, [graph, scale]);

  const zoomToFit = useCallback(() => {
    if (graph) {
      graph.zoomToFit({ maxScale: 1 });
    }
  }, [graph]);

  const zoomTo = useCallback(
    (to: number) => {
      if (graph) {
        graph.zoomTo(to);
      }
    },
    [graph],
  );

  return (
    <div className="absolute bottom-4 left-4 flex h-12 items-center rounded-md border bg-white p-1 shadow-sm">
      <Button
        onClick={zoomOut}
        disabled={scale <= 0.5}
        className="px-2"
        variant="ghost"
        icon={<ZoomOut className="size-4" />}
      />
      <Popover
        content={
          <Command className="w-[150px] text-gray-700">
            <CommandList>
              <CommandItem className="cursor-pointer" onSelect={() => zoomTo(1.5)}>
                <span className="ml-2">150%</span>
              </CommandItem>
              <CommandItem className="cursor-pointer" onSelect={() => zoomTo(1)}>
                <span className="ml-2">100%</span>
              </CommandItem>
              <CommandItem className="cursor-pointer" onSelect={() => zoomTo(0.75)}>
                <span className="ml-2">75%</span>
              </CommandItem>
              <CommandItem className="cursor-pointer" onSelect={() => zoomTo(0.5)}>
                <span className="ml-2">50%</span>
              </CommandItem>
              <CommandSeparator />
              <CommandItem className="cursor-pointer" onSelect={() => zoomTo(1)}>
                <span className="ml-2">原尺寸</span>
              </CommandItem>
              <CommandItem className="cursor-pointer" onSelect={() => zoomToFit()}>
                <span className="ml-2">自适应</span>
              </CommandItem>
            </CommandList>
          </Command>
        }
        align="end"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <Button
          text={`${Math.floor(scale * 100)}%`}
          onClick={() => {
            setOpenPopover(!openPopover);
          }}
          className="px-2"
          variant="ghost"
        />
      </Popover>
      <Button
        onClick={zoomIn}
        disabled={scale >= 1.5}
        className="px-2"
        variant="ghost"
        icon={<ZoomIn className="size-4" />}
      />
    </div>
  );
}
