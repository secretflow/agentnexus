import type { WorkStatus } from "./work-status";

type WorkContextType = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  input: any;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  output: any;
  status: WorkStatus;
  error?: string;
};
export class WorkContext<Type = WorkContextType> {
  private map: Map<string, Type>;

  constructor(map?: Map<string, Type>) {
    this.map = map ? map : new Map<string, Type>();
  }

  get(key: string): Type | undefined {
    return this.map.get(key);
  }

  set(key: string, value: Type) {
    this.map.set(key, value);
  }

  delete(key: string) {
    this.map.delete(key);
  }

  has(key: string): boolean {
    return this.map.has(key);
  }

  clear() {
    this.map.clear();
  }

  forEach(callbackFn: (value: Type, key: string, map: Map<string, Type>) => void) {
    this.map.forEach(callbackFn);
  }

  toJson(): Record<string, Type> {
    return Object.fromEntries(this.map);
  }
}
