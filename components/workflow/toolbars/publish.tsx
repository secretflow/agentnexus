import { useViewCodeModal } from "@/components/modals";
import { Button } from "@/components/ui";
import { NODE_ATTRS } from "@/lib/constants";
import { useApplication } from "@/lib/swr";
import { Rocket, RouteOff, SquareCode } from "lucide-react";
import { useCallback, useContext, useMemo, useState } from "react";
import { toast } from "sonner";
import { GraphContext } from "../graph-provider";

export function PublishTool() {
  const { application, mutate } = useApplication();
  const { nodes } = useContext(GraphContext);
  const [loading, setLoading] = useState(false);

  const variables = useMemo(() => {
    const startNode = nodes.find((node) => node.data.type === NODE_ATTRS.start.id);
    if (!startNode) {
      return [];
    }
    return startNode.data.configs.variables;
  }, [nodes]);

  const { setShowViewCodeModal, ViewCodeModal } = useViewCodeModal({
    variables,
  });

  const togglePublishState = useCallback(async () => {
    if (!application) {
      return;
    }

    const publishState = !application.published;

    try {
      setLoading(true);

      const res = await fetch(
        `/api/applications/${application?.id}?workspaceId=${application?.workspaceId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            published: publishState,
          }),
        },
      );
      if (res.ok) {
        await mutate();
        toast.success(`${publishState ? "发布" : "取消发布"}成功！`);
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      toast.error(`${publishState ? "发布" : "取消发布"}失败，请稍后重试！`);
    } finally {
      setLoading(false);
    }
  }, [application]);

  if (!application) {
    return null;
  }

  return (
    <>
      <ViewCodeModal />
      <Button
        text={application.published ? "取消发布" : "发布"}
        onClick={togglePublishState}
        className="px-2"
        variant="ghost"
        icon={
          application.published ? <RouteOff className="size-4" /> : <Rocket className="size-4" />
        }
        disabled={loading}
      />
      <Button
        text="访问"
        onClick={() => {
          if (application.published) {
            setShowViewCodeModal(true);
          }
        }}
        className="px-2"
        variant="ghost"
        icon={<SquareCode className="size-4" />}
        disabledTooltip={!application?.published ? "应用未发布" : undefined}
      />
    </>
  );
}
