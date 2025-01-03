import { NODE_ATTRS } from "@/lib/constants";
import { registerNodeConfig } from "../registry";

const defaultConfig = {};

function ConfigComponent() {
  return <div>Config</div>;
}

registerNodeConfig(NODE_ATTRS.repeat.id, ConfigComponent, defaultConfig);
