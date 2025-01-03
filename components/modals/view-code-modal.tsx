"use client";

import { Modal, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { CodeBlock } from "@/components/ui";
import type { VariableProps } from "@/lib/zod";
import { SquareCode } from "lucide-react";
import { Link } from "next-view-transitions";
import { useParams } from "next/navigation";
import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";

const cURLCode = (applicationId: string, variables: VariableProps[]) => {
  const payload: Record<string, string | number> = {};
  variables.forEach((variable) => {
    payload[variable.name] = variable.type === "number" ? 0 : "";
  });

  return `curl ${process.env.NEXT_PUBLIC_APP_URL}/api/apps/${applicationId}/workflow \\
     -X POST \\
     -H "Content-Type: application/json" \\
     -H "Authorization: YOUR_API_KEY" \\
     -d '${JSON.stringify(payload)}'`;
};

function ViewCodeModal({
  variables,
  showViewCodeModal,
  setShowViewCodeModal,
}: {
  variables: VariableProps[];
  showViewCodeModal: boolean;
  setShowViewCodeModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { workspaceId, applicationId } = useParams<{
    workspaceId: string;
    applicationId: string;
  }>();

  return (
    <Modal
      showModal={showViewCodeModal}
      setShowModal={setShowViewCodeModal}
      className="max-w-[650px]"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SquareCode />
            <h3 className="!mt-0 max-w-sm truncate font-medium text-lg">访问</h3>
          </div>
        </div>

        <p className="mt-4 text-muted-foreground text-sm">你可以使用下面的代码访问该应用。</p>

        <div className="mt-4 mb-6">
          <Tabs defaultValue="curl" className="w-[600px]">
            <TabsList>
              <TabsTrigger value="curl">cURL</TabsTrigger>
              <TabsTrigger value="typescript">TypeScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
            </TabsList>
            <TabsContent value="curl">
              <CodeBlock
                className="border border-gray-200"
                language="bash"
                value={cURLCode(applicationId, variables)}
                readOnly
              />
            </TabsContent>
            <TabsContent value="typescript">
              <CodeBlock language="bash" value="echo 111" />
            </TabsContent>
            <TabsContent value="python">
              <CodeBlock language="bash" value="echo 111" />
            </TabsContent>
          </Tabs>
        </div>

        <p className="mt-4 text-muted-foreground text-sm">
          YOUR_API_KEY 可以在
          <Link
            href={`/${workspaceId}/${applicationId}/settings/tokens`}
            className="px-1 text-gray-700 underline underline-offset-2 transition-colors hover:text-black"
          >
            这里
          </Link>
          创建。
        </p>
      </div>
    </Modal>
  );
}

export function useViewCodeModal({
  variables,
}: {
  variables: VariableProps[];
}) {
  const [showViewCodeModal, setShowViewCodeModal] = useState(false);

  const ViewCodeModalCallback = useCallback(() => {
    return (
      <ViewCodeModal
        variables={variables}
        showViewCodeModal={showViewCodeModal}
        setShowViewCodeModal={setShowViewCodeModal}
      />
    );
  }, [showViewCodeModal, setShowViewCodeModal]);

  return useMemo(
    () => ({ setShowViewCodeModal, ViewCodeModal: ViewCodeModalCallback }),
    [setShowViewCodeModal, ViewCodeModalCallback],
  );
}
