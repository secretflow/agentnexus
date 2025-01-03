"use client";

import {
  ChatPlayground,
  PublishChatAppButton,
  VisitChatAppButton,
} from "@/components/chat-playground";
import { MaxWidthWrapper } from "@/components/layout";
import { WorkflowGraph } from "@/components/workflow";
import { useMediaQuery } from "@/lib/hooks";
import { useApplication } from "@/lib/swr";

export default function Application() {
  const { application } = useApplication();

  if (!application) {
    return null;
  }

  if (application.type === "workflow") {
    return <WorkflowApplication />;
  }

  if (application.type === "agent") {
    return <AgentApplication />;
  }

  return null;
}

function WorkflowApplication() {
  const { height } = useMediaQuery();
  // Subtract 110 for the header
  const graphHeight = height! - 110;

  return (
    <div className="relative w-full" style={{ height: graphHeight }}>
      <WorkflowGraph />
    </div>
  );
}

function AgentApplication() {
  return (
    <>
      <div className="flex h-20 items-center border-gray-200 border-b bg-gray-50/80">
        <MaxWidthWrapper>
          <div className="flex items-center justify-between">
            <h1 className="truncate text-2xl text-gray-600">Playground</h1>
            <div className="flex space-x-2">
              <PublishChatAppButton />
              <VisitChatAppButton />
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
      <MaxWidthWrapper>
        <ChatPlayground />
      </MaxWidthWrapper>
    </>
  );
}
