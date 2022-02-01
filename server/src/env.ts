import * as env from "env-var";

export interface Env {
  readonly rootPath: string;
}

export function buildEnv(): Env {
  return {
    rootPath: env.get("ROOT_PATH").required().asString(),
  };
}
