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

  private static generate<Config extends Configuration, Env extends ENVConfiguration>(
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

  public get<P1 extends keyof NonNullable<Config>>(): NonNullable<Config> | undefined;
  public get<P1 extends keyof NonNullable<Config>>(prop1: P1): NonNullable<Config>[P1] | undefined;
  public get<P1 extends keyof NonNullable<Config>, P2 extends keyof NonNullable<NonNullable<Config>[P1]>>(
    prop1: P1,
    prop2: P2
  ): NonNullable<NonNullable<Config>[P1]>[P2] | undefined;
  public get<
    P1 extends keyof NonNullable<Config>,
    P2 extends keyof NonNullable<NonNullable<Config>[P1]>,
    P3 extends keyof NonNullable<NonNullable<Config>[P1]>[P2]
  >(prop1: P1, prop2: P2, prop3: P3): NonNullable<NonNullable<NonNullable<Config>[P1]>[P2]>[P3] | undefined;
  public get<
    P1 extends keyof NonNullable<Config>,
    P2 extends keyof NonNullable<NonNullable<Config>[P1]>,
    P3 extends keyof NonNullable<NonNullable<Config>[P1]>[P2],
    P4 extends keyof NonNullable<NonNullable<NonNullable<Config>[P1]>[P2]>[P3]
  >(
    prop1: P1,
    prop2: P2,
    prop3: P3,
    prop4: P4
  ): NonNullable<NonNullable<NonNullable<NonNullable<Config>[P1]>[P2]>[P3]>[P4] | undefined;
  public get(...props: string[]): any {
    return props.reduce((result, prop) => (result == null ? undefined : result[prop]), this.config as any);
  }

  public getp(path?: string): unknown {
    const matches = (path || "").match(
      /([a-zA-Z0-9]+)|(?=[a-zA-Z0-9]+\[)([a-zA-Z0-9]+)|(?=\[[a-zA-Z0-9]+\])([a-zA-Z0-9]+)/g
    ) || [];
    return matches.reduce((result, prop) => (result == null ? undefined : result[prop]), this.config as any);
  }
}
