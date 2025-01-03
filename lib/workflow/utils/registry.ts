import { Registry } from "@/lib/utils";

const workRegistry = new Registry();

function registerWork(name: string) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return (target: any) => {
    workRegistry.register(name, target);
    return target;
  };
}

export { workRegistry, registerWork };
