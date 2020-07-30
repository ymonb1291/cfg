import { Cfg } from "./cfg.ts";
import { isPlainObject } from "./utils.ts";
import { Opts, Loadable } from "./options.ts";
import { Configuration } from "./store.ts";

export function cfg<Config extends Configuration>(): Cfg<Config>;
export function cfg<Config extends Configuration>(scope: string): Cfg<Config>;
export function cfg<Config extends Configuration>(load: Loadable[]): Cfg<Config>;
export function cfg<Config extends Configuration>(scope: string, load: Loadable[]): Cfg<Config>;
export function cfg<Config extends Configuration>(options: Opts): Cfg<Config>;
export function cfg<Config extends Configuration>(...args: any): Cfg<Config> {
  switch (args.length) {
    case 2:
      return Cfg.init<Config>({
        load: args[1],
        scope: args[0],
      });
    case 1:
      if (typeof args[0] === "string") {
        return Cfg.init<Config>({
          scope: args[0],
        });
      } else if (Array.isArray(args[0])) {
        return Cfg.init<Config>({
          load: args[0],
        });
      } else if (isPlainObject(args[0])) {
        return Cfg.init<Config>(args[0] as object);
      } else {
        throw new Error(`Invalid argument`);
      }
    default:
      return Cfg.init<Config>({});
  }
}
