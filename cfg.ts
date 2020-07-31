import { Opts, Options, InternalOptions } from "./options.ts";
import { DEFAULT_SCOPE } from "./constants.ts";
import { Store } from "./store.ts";
import { Loader } from "./loader.ts";
import { ErrorHandler } from "./error.ts";

type ValueType = string | number | boolean | Configuration;

export interface Configuration {
  [key: string]: ValueType | ValueType[];
}

export interface ENVConfiguration {
  [key: string]: string | number | boolean;
}

export class Cfg<Config extends Configuration, Env extends ENVConfiguration> extends Store {
  private constructor(public config: Config, public env: Env) {
    super();
  }

  private static createScope<Config extends Configuration, Env extends ENVConfiguration>(
    scope: string,
    opts: Opts
  ): Cfg<Config, Env> {
    const options: Options = new Options(opts);
    const iOpts: InternalOptions = options.internalOptions;
    const loader: Loader = new Loader(iOpts);
    const data: [Configuration, ENVConfiguration] = loader.load();
    return this.setScope(scope, new Cfg<Config, Env>(data[0] as Config, data[1] as Env));
  }

  public static generate<Config extends Configuration, Env extends ENVConfiguration>(
    opts: Opts
  ): Cfg<Config, Env> {
    opts.scope = opts.scope || DEFAULT_SCOPE;
    
    if (this.hasScope(opts.scope)) {
      return this.getScope(opts.scope);
    } else {
      return this.createScope<Config, Env>(opts.scope, opts);
    }
  }

  public static init<Config extends Configuration, Env extends ENVConfiguration>(
    opts: Opts
  ): Cfg<Config, Env> {
    try {
      return this.generate<Config, Env>(opts);
    } catch (error) {
      ErrorHandler.print(error);
      Deno.exit(0);
    }
  }
}
