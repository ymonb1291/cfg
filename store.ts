import { Cfg } from "./cfg.ts";

interface Configurations {
  [key: string]: Cfg;
}

export abstract class Store {
  private static configurations: Configurations = {};

  protected static getScope(scope: string): Cfg {
    if (this.hasScope(scope)) {
      return this.configurations[scope.toLowerCase()];
    } else {
      throw new Error(`Internal error [UNKNOWN_SCOPE].`);
    }
  }

  protected static hasScope(scope: string): boolean {
    return Object.keys(this.configurations).includes(scope.toLocaleLowerCase());
  }

  protected static setScope(scope: string, config: Cfg): Cfg {
    if (!this.hasScope(scope)) {
      return (this.configurations[scope.toLowerCase()] = config);
    } else {
      throw new Error(`Internal error [FORBIDDEN_SCOPE_OVERWRITE].`);
    }
  }
}
