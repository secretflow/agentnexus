// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export class Registry<Entity = any> {
  private data = new Map<string, Entity>();

  register(name: string, data: Entity, force?: boolean) {
    if (this.exist(name) && !force) {
      this.onDuplicated(name);
    }
    this.data.set(name, data);
    return data;
  }

  unregister(name: string) {
    const entity = this.data.get(name);
    this.data.delete(name);
    return entity;
  }

  get(name: string) {
    return this.data.get(name);
  }

  exist(name: string) {
    return this.data.has(name);
  }

  onDuplicated(name: string) {
    throw new Error(`Entity with name '${name}' already registered.`);
  }

  keys() {
    return Array.from(this.data.keys());
  }

  values() {
    return Array.from(this.data.values());
  }
}
