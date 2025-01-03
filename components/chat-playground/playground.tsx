import { useChatApplication } from "@/lib/swr";
import type { UpsertChatAppProps } from "@/lib/zod";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { Chat } from "./chat";
import { KnowledgebasesForm } from "./knowledgebases-form";
import { ModelSelectorForm } from "./model-form";
import { PromptForm } from "./prompt-form";
import { ToolsForm } from "./tools-form";

export function ChatPlayground() {
  const { chatApplication } = useChatApplication();
  const { applicationId, workspaceId } = useParams<{
    applicationId: string;
    workspaceId: string;
  }>();
  const [chatAppConfigs, setChatAppConfigs] = useState<UpsertChatAppProps>({});

  useEffect(() => {
    if (chatApplication) {
      const { model, prompt, tool, config, knowledgebase } = chatApplication;
      setChatAppConfigs({
        model,
        prompt,
        tool,
        config,
        knowledgebase,
      });
    }
  }, [chatApplication]);

  const handleSubmit = (params: UpsertChatAppProps, cb?: () => void) => {
    fetch(`/api/applications/${applicationId}/chatapp?workspaceId=${workspaceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    }).then(async (res) => {
      if (res.ok) {
        cb?.();
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    });
  };

  const debouncedHandleSubmit = useDebouncedCallback(handleSubmit, 2000);

  if (!chatApplication) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-8 py-6 sm:flex-row">
      <div className="max-h-[calc(100vh_-_230px)] flex-1 overflow-y-auto rounded-lg border border-gray-200 bg-white text-gray-700">
        <ModelSelectorForm
          value={chatAppConfigs.model}
          onValueChange={(model) => {
            setChatAppConfigs((prev) => ({ ...prev, model }));
            handleSubmit({ model });
          }}
        />
        <PromptForm
          value={chatAppConfigs.prompt}
          onValueChange={(prompt) => {
            setChatAppConfigs((prev) => ({ ...prev, prompt }));
            debouncedHandleSubmit({ prompt });
          }}
        />
        <ToolsForm
          value={chatAppConfigs.tool}
          onValueChange={(tool) => {
            setChatAppConfigs((prev) => ({ ...prev, tool }));
            handleSubmit({ tool });
          }}
        />
        <KnowledgebasesForm
          knowledgebases={chatAppConfigs.knowledgebase}
          onKnowledgebasesChange={(knowledgebase) => {
            setChatAppConfigs((prev) => ({ ...prev, knowledgebase }));
            handleSubmit({ knowledgebase });
          }}
          recallConfig={chatAppConfigs.config?.recall}
          onRecallConfigChange={(recall) => {
            if (recall) {
              setChatAppConfigs((prev) => ({ ...prev, config: { ...prev.config, recall } }));
              handleSubmit({ config: { ...chatAppConfigs.config, recall } }, () => {
                toast.success("召回配置已更新");
              });
            }
          }}
        />
      </div>
      <div className="max-h-[calc(100vh_-_230px)] flex-1 rounded-lg bg-white ring-1 ring-gray-700/10">
        <Chat
          model={chatAppConfigs.model}
          prompt={chatAppConfigs.prompt}
          tools={chatAppConfigs.tool}
          config={chatAppConfigs.config}
          knowledgebases={chatAppConfigs.knowledgebase}
          initialMessages={[]}
        />
      </div>
    </div>
  );
}
