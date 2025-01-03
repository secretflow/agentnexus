import { Registry } from "@/lib/utils";

const nodeConfigRegistry = new Registry<{
  component: React.ElementType;
  defaultConfig: Record<string, unknown>;
}>();

function registerNodeConfig(
  name: string,
  component: React.ElementType,
  defaultConfig: Record<string, unknown> = {},
) {
  nodeConfigRegistry.register(name, {
    component,
    defaultConfig,
  });
}

export { nodeConfigRegistry, registerNodeConfig };
