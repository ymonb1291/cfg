import { ScopeOverwriteError, UnknownScopeError } from "./error.ts";

import type { Conf, Config, Env } from "./config.ts";

type Instance<C extends Conf = {}, E extends Env = {}> = [
  symbol | string,
  Config<C, E>,
];

export class Store<C extends Conf = {}, E extends Env = {}> {
  private static instances: Instance[] = [];

  public get(scope: string | symbol): Config<C, E> {
    const config = this.lookup(scope);
    if (!config) {
      throw new UnknownScopeError(scope);
    }
    return config;
  }

  public has(scope: string | symbol): boolean {
    return this.lookup(scope) ? true : false;
  }

  public set(scope: string | symbol, config: Config<C, E>): Config<C, E> {
    if (!this.has(scope)) {
      scope = typeof scope === "string" ? scope.toLowerCase() : scope;
      Store.instances[Store.instances.length] = [scope, config];
      return config;
    } else {
      throw new ScopeOverwriteError(scope);
    }
  }

  private lookup(scope: string | symbol): Config<C, E> | void {
    scope = typeof scope === "string" ? scope.toLowerCase() : scope;
    const res: Instance | void = Store.instances
      .find((el) => el[0] === scope);
    return res ? res[1] as Config<C, E> : void 0;
  }
}
