import { Opts, Options, InternalOptions } from "./options.ts";
import { DEFAULT_SCOPE } from "./constants.ts";
import { Configuration, Store } from "./store.ts";
import { Loader } from "./loader.ts";

export interface ENVConfiguration {
  [key: string]: string | number | boolean;
}

export class Cfg<Config extends Configuration, Env extends ENVConfiguration> extends Store {
  private constructor(public config: Config, public env: Env) {
    super();
  }

  public static init<Config extends Configuration, Env extends ENVConfiguration>(opts: Opts): Cfg<Config, Env> {
    opts.scope = opts.scope || DEFAULT_SCOPE;
    if (this.hasScope(opts.scope)) {
      return this.getScope(opts.scope);
    } else {
      const options: Options = new Options(opts);
      const iOpts: InternalOptions = options.internalOptions;
      const loader: Loader = new Loader(iOpts);
      const data: [Configuration, ENVConfiguration] = loader.load();
      return this.setScope(opts.scope, new Cfg<Config, Env>(data[0] as Config, data[1] as Env));
    }
  }
}
