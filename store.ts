import { Cfg, ENVConfiguration, Configuration } from "./cfg.ts";

interface Configurations {
  [key: string]: Cfg<Configuration, ENVConfiguration>;
}

export abstract class Store {
  private static configurations: Configurations = {};

  protected static getScope<Config extends Configuration, Env extends ENVConfiguration>(
    scope: string
  ): Cfg<Config, Env> {
    if (this.hasScope(scope)) {
      return this.configurations[scope.toLowerCase()] as Cfg<Config, Env>;
    } else {
      throw new Error(`Internal error [UNKNOWN_SCOPE].`);
    }
  }

  protected static hasScope(scope: string): boolean {
    return Object.keys(this.configurations).includes(scope.toLocaleLowerCase());
  }

  protected static setScope<Config extends Configuration, Env extends ENVConfiguration>(
    scope: string,
    config: Cfg<Config, Env>
  ): Cfg<Config, Env> {
    if (!this.hasScope(scope)) {
      return (this.configurations[scope.toLowerCase()] = config);
    } else {
      throw new Error(`Internal error [FORBIDDEN_SCOPE_OVERWRITE].`);
    }
  }
}
