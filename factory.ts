import { Cfg, ENVConfiguration, Configuration } from "./cfg.ts";
import { isPlainObject } from "./utils.ts";
import { Opts, Loadable } from "./options.ts";

export function cfg<Config extends Configuration, Env extends ENVConfiguration>(): Cfg<Config, Env>;
export function cfg<Config extends Configuration, Env extends ENVConfiguration>(
  scope: string
): Cfg<Config, Env>;
export function cfg<Config extends Configuration, Env extends ENVConfiguration>(
  load: Loadable[]
): Cfg<Config, Env>;
export function cfg<Config extends Configuration, Env extends ENVConfiguration>(
  scope: string,
  load: Loadable[]
): Cfg<Config, Env>;
export function cfg<Config extends Configuration, Env extends ENVConfiguration>(
  options: Opts
): Cfg<Config, Env>;
export function cfg<Config extends Configuration, Env extends ENVConfiguration>(
  ...args: any
): Cfg<Config, Env> {
  switch (args.length) {
    case 2:
      return Cfg.init<Config, Env>({
        load: args[1],
        scope: args[0],
      });
    case 1:
      if (typeof args[0] === "string") {
        return Cfg.init<Config, Env>({
          scope: args[0],
        });
      } else if (Array.isArray(args[0])) {
        return Cfg.init<Config, Env>({
          load: args[0],
        });
      } else if (isPlainObject(args[0])) {
        return Cfg.init<Config, Env>(args[0] as object);
      } else {
        throw new Error(`Invalid argument`);
      }
    default:
      return Cfg.init<Config, Env>({});
  }
}
