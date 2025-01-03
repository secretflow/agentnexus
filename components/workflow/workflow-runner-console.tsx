import {
  Alert,
  AlertDescription,
  AlertTitle,
  LoadingSpinner,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { useApplication } from "@/lib/swr";
import { TriangleAlert } from "lucide-react";
import { useCallback, useContext, useState } from "react";
import { GraphContext } from "./graph-provider";
import { type VariableValue, VariableValueGetter, VariableValueSetter } from "./variable";

type TabsValue = "input" | "result";

export function WorkflowRunnerConsole() {
  const { application } = useApplication();

  const { consolePanelOpen, setConsolePanelOpen, nodes, edges } = useContext(GraphContext);
  const [activeTab, setActiveTab] = useState<TabsValue>("input");

  const [inputVariableValues, setInputVariableValues] = useState<VariableValue>();
  const [outputVariableValues, setOutputVariableValues] = useState<VariableValue>();

  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startNode = nodes.find((node) => node.data.type === "start");
  const endNode = nodes.find((node) => node.data.type === "end");

  const run = useCallback(
    async (data: VariableValue) => {
      setActiveTab("result");
      setOutputVariableValues(undefined);
      setErrorMessage(undefined);
      setIsSubmitting(true);

      try {
        const res = await fetch(
          `/api/applications/${application?.id}/workflow/execution?workspaceId=${application?.workspaceId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ dag: { nodes, edges }, input: data }),
          },
        );
        if (res.ok) {
          const json = await res.json();
          if (endNode?.id) {
            setOutputVariableValues(json[endNode.id]?.output);
          }
        } else {
          const { message } = await res.json();
          setErrorMessage(message);
        }
      } catch (e) {
        if (e instanceof Error) {
          setErrorMessage(e.message);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [nodes, edges],
  );

  return (
    <Sheet open={consolePanelOpen} onOpenChange={setConsolePanelOpen} modal={false}>
      <SheetContent className="top-[109px] p-0 sm:w-[540px]">
        <SheetHeader className="px-4 py-2">
          <SheetTitle className="flex items-center text-gray-700">运行控制台</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="border-t p-4">
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as TabsValue)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="input">输入</TabsTrigger>
              <TabsTrigger value="result">结果</TabsTrigger>
            </TabsList>
            <TabsContent value="input">
              {startNode ? (
                <VariableValueSetter
                  className="mt-4"
                  variableValues={inputVariableValues}
                  variables={startNode.data.configs.variables}
                  onSuccess={(data) => {
                    setInputVariableValues(data);
                    run(data);
                  }}
                />
              ) : (
                <Alert>
                  <TriangleAlert className="h-4 w-4" />
                  <AlertTitle>提醒</AlertTitle>
                  <AlertDescription>画布中缺少开始节点</AlertDescription>
                </Alert>
              )}
            </TabsContent>
            <TabsContent value="result">
              {isSubmitting ? (
                <div className="flex h-10 w-full items-center justify-center">
                  <LoadingSpinner className="h-4 w-4" />
                </div>
              ) : (
                <div className="max-h-[500px] overflow-auto">
                  {outputVariableValues && (
                    <VariableValueGetter variableValues={outputVariableValues} />
                  )}
                  {errorMessage && (
                    <Alert className="mt-4" variant="destructive">
                      <TriangleAlert className="h-4 w-4" />
                      <AlertTitle>运行失败</AlertTitle>
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
