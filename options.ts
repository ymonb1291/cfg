import { Configuration } from "./store.ts";

// TODO: Loadable could also be a path that points to a yaml/toml/json configuration
export type Loadable = Configuration;

export interface Opts {
  load?: Loadable[];
  scope?: string;
}

export class Options {
  //
}
