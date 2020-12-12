import type { Env } from "./config.ts";
import type { Source, SourceFn } from "./settings.interface.ts";

interface EnvOptions {
  export?: boolean;
  infer?: boolean;
  load?: Exclude<Source<Env>, SourceFn> | Exclude<Source<Env>, SourceFn>[];
  safe?: boolean;
}

export interface Options {
  env?: boolean | EnvOptions;
  load?: Source | Source[];
  scope?: string | symbol;
}
