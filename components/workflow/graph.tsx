import { Background, Snapline, XFlow, XFlowGraph } from "@antv/xflow";
import { Portal } from "@antv/xflow";
import { GraphInitializer } from "./graph-initializer";
import { GraphProvider } from "./graph-provider";
import { NodeConfigPanel } from "./node-config-panel";
import { NodeSelector } from "./node-selector";
import { FooterToolbars, HeaderToolbars } from "./toolbars";
import { WorkflowRunnerConsole } from "./workflow-runner-console";
import "./edge-registry";

const XFlowReactPortalProvider = Portal.getProvider();

export function WorkflowGraph() {
  return (
    <XFlow>
      <XFlowReactPortalProvider />
      <XFlowGraph
        zoomable
        zoomOptions={{
          factor: 1.1,
          minScale: 0.5,
          maxScale: 1.5,
          modifiers: "ctrl",
        }}
        pannable
        panOptions={{
          eventTypes: ["leftMouseDown", "mouseWheel"],
        }}
        centerView
        fitView
        connectionEdgeOptions={{
          shape: "dag-edge",
        }}
        magnetAvailableHighlightOptions={{
          name: "stroke",
          args: {
            attrs: {
              fill: "#fff",
              stroke: "#000",
              "stroke-width": 2,
            },
          },
        }}
        magnetAdsorbedHighlightOptions={{
          name: "stroke",
          args: {
            attrs: {
              fill: "#fff",
              stroke: "#000",
              "stroke-width": 2,
            },
          },
        }}
        connectionOptions={{
          snap: {
            radius: 50,
          },
          allowBlank: false,
          allowLoop: false,
          highlight: true,
          connectionPoint: "anchor",
          anchor: "center",
          connector: {
            name: "smooth",
            args: {
              direction: "H",
            },
          },
          validateMagnet({ magnet }) {
            return magnet.getAttribute("port-group") !== "left";
          },
          validateConnection({ sourceMagnet, targetMagnet }) {
            if (!sourceMagnet || sourceMagnet.getAttribute("port-group") === "left") {
              return false;
            }
            if (!targetMagnet || targetMagnet.getAttribute("port-group") !== "left") {
              return false;
            }
            return true;
          },
        }}
        magnetThreshold={10}
        keyboardOptions={{
          global: true,
        }}
        selectOptions={{
          rubberband: true,
          modifiers: "shift",
        }}
      />
      <Background color="#f8fafc" />
      <Snapline sharp />
      <GraphProvider>
        <GraphInitializer />
        <NodeSelector />
        <NodeConfigPanel />
        <WorkflowRunnerConsole />
        <HeaderToolbars />
        <FooterToolbars />
      </GraphProvider>
    </XFlow>
  );
}
