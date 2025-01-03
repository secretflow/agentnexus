import { consola } from "consola";

export const log = {
  start(msg: string) {
    if (process.env.NODE_ENV === "development") {
      consola.start(msg);
    }
  },
  success(msg: string) {
    if (process.env.NODE_ENV === "development") {
      consola.success(msg);
    }
  },
  error(err: Error) {
    if (process.env.NODE_ENV === "development") {
      consola.error(err);
    }
  },
};
