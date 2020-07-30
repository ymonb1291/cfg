import { Opts } from "./options.ts";
import { DEFAULT_LOADABLE, DEFAULT_SCOPE } from "./constants.ts";
import { Configuration, Store } from "./store.ts";

export class Cfg<Config extends Configuration> extends Store {
  private constructor(public config: Config) {
    super();
  }

  public static init<Config extends Configuration>(options: Opts): Cfg<Config> {
    if (this.hasScope(options.scope || DEFAULT_SCOPE)) {
      return this.getScope(options.scope || DEFAULT_SCOPE);
    } else {
      let cfg: Cfg<Config>;
      if (Array.isArray(options.load)) {
        cfg = new Cfg<Config>(options.load[0] as Config); // TODO: type assertion must be removed
      } else {
        cfg = new Cfg<Config>(DEFAULT_LOADABLE as Config); // TODO: type assertion must be removed
      }
      return this.setScope(options.scope || DEFAULT_SCOPE, cfg);
    }
  }
}
