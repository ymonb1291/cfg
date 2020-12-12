import type { Conf, Env, KeyValuePairs } from "./config.ts";

export type SourceFn<T extends Env = any> = (env: T) => KeyValuePairs;
export type Source<T = Conf> = string | T | SourceFn;

interface EnvSettings {
  export: boolean;
  infer: boolean;
  load: Exclude<Source<Env>, SourceFn>[];
  safe: boolean;
}

export interface Settings {
  env: EnvSettings;
  load: Source<Conf>[];
  scope: string | symbol;
}
