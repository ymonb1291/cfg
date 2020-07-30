import { Cfg } from "./cfg.ts";

type ValueType = string | number | boolean | Configuration;

export interface Configuration {
  [key: string]: ValueType | ValueType[];
}

interface Configurations {
  [key: string]: Cfg<Configuration>;
}

export abstract class Store {
  private static configurations: Configurations = {};

  protected static getScope<Config extends Configuration>(scope: string): Cfg<Config> {
    if (this.hasScope(scope)) {
      return this.configurations[scope.toLowerCase()] as Cfg<Config>;
    } else {
      throw new Error(`Internal error [UNKNOWN_SCOPE].`);
    }
  }

  protected static hasScope(scope: string): boolean {
    return Object.keys(this.configurations).includes(scope.toLocaleLowerCase());
  }

  protected static setScope<Config extends Configuration>(scope: string, config: Cfg<Config>): Cfg<Config> {
    if (!this.hasScope(scope)) {
      return (this.configurations[scope.toLowerCase()] = config);
    } else {
      throw new Error(`Internal error [FORBIDDEN_SCOPE_OVERWRITE].`);
    }
  }
}
