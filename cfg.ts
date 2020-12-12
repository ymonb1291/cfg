import { Config } from "./config.ts";
import { Store } from "./store.ts";

import type { Conf, Env } from "./config.ts";
import type { Options } from "./options.interface.ts";
import type { Settings, Source } from "./settings.interface.ts";

export const DEFAULT_SCOPE: symbol = Symbol("DEFAULT");

/**
 * Loads the configuration on the default scope.
 * 
 * **Example**
 * ```
 * // Init Cfg
 * Cfg([{a:"A"}, {b:"B"}]);
 * // Load default scope
 * let cfg = Cfg();
 * console.log(cfg.get()); 
 * // -> {a:"A", b:"B"}
 * ```
 */
export function Cfg<C extends Conf, E extends Env = {}>(): Config<C, E>;

/**
 * Loads the configuration on the specified scope.
 * 
 * **Example**
 * ```
 * // Init Cfg
 * Cfg("Example", [{a:"A"}, {b:"B"}]);
 * // Load scope
 * let cfg = Cfg("Example");
 * console.log(cfg.get()); 
 * // -> {a:"A", b:"B"}
 * ```
 */
export function Cfg<C extends Conf, E extends Env = {}>(
  scope: string,
): Config<C, E>;
/**
 * Creates a configuration on the default scope.
 * 
 * **Example**
 * ```
 * let cfg = Cfg([{a:"A"}, {b:"B"}]);
 * console.log(cfg.get()); 
 * // -> {a:"A", b:"B"}
 * ```
 */
export function Cfg<C extends Conf, E extends Env = {}>(
  load: Source[],
): Config<C, E>;
/**
 * Creates a configuration on the specified scope.
 * 
 * **Example**
 * ```
 * let cfg = Cfg("Example", [{a:"A"}, {b:"B"}]);
 * console.log(cfg.get()); 
 * // -> {a:"A", b:"B"}
 * ```
 */
export function Cfg<C extends Conf, E extends Env = {}>(
  scope: string,
  load: Source[],
): Config<C, E>;
/**
 * Creates a configuration with options.
 * 
 * **Example**
 * ```
 * let cfg = Cfg({
 *  env: true,
 *  load: [
 *    {a:"A"},
 *    {b:"B"},
 *  ]});
 * console.log(cfg.get()); 
 * // -> {a:"A", b:"B"}
 * ```
 */
export function Cfg<C extends Conf, E extends Env = {}>(
  options: Options,
): Config<C, E>;
export function Cfg<C extends Conf, E extends Env = {}>(
  ...args: [] | [string | Source[] | Options] | [string, Source[]]
): Config<C, E> {
  // Generate an Options object that represents the data passed as parameter
  const options: Options = populateOptions();

  // Generate Settings
  const settings: Settings = {
    env: genEnvSettings(options.env),
    load: Array.isArray(options.load)
      ? options.load
      : options.load
      ? [options.load]
      : [],
    scope: options.scope || DEFAULT_SCOPE,
  };

  // Init Store
  const store = new Store<C, E>();

  /**
   * If we're trying to load a configuration, it means that we're trying
   * to create a new Config. Then we must call store.Set().
   * 
   * Otherwise, settings.load is empty and we are trying to load an existing instance
   * of Config
   */
  if (settings.load.length) {
    return store.set(settings.scope, new Config<C, E>(settings));
  } else {
    return store.get(settings.scope);
  }

  /** Converts ...args to an object Options */
  function populateOptions(): Options {
    if (args.length === 2) {
      // Cfg("...", [...]) was called
      return {
        load: args[1],
        scope: args[0],
      };
    } else if (Array.isArray(args[0])) {
      // Cfg([...]) was called
      return { load: args[0] };
    } else if (typeof args[0] === "object") {
      // Cfg({...}) was called
      return args[0];
    } else if (typeof args[0] === "string") {
      // Cfg("...") was called
      return { scope: args[0] };
    }
    // Cfg() was called
    return {};
  }

  /** Generates Settings.env */
  function genEnvSettings(envOpts: Options["env"]): Settings["env"] {
    // Default settings
    const settings: Settings["env"] = {
      export: false,
      infer: false,
      load: [],
      safe: true,
    };

    if (!envOpts) {
      // envOpts is false
      return settings;
    } else if (typeof envOpts === "boolean" && envOpts) {
      // envOpts is true
      settings.load = [".env"];
      return settings;
    }

    if (typeof envOpts.export === "boolean") {
      // envOpts.export is boolean
      settings.export = envOpts.export;
    }

    if (Array.isArray(envOpts.load)) {
      // envOpts.load is an Array
      settings.load = envOpts.load;
    } else if (
      typeof envOpts.load === "string" || typeof envOpts.load === "object"
    ) {
      // envOpts.load is a string or an object
      settings.load = [envOpts.load];
    } else {
      // envOpts is true but envOpts.load is undefined
      settings.load = [".env"];
    }

    if (typeof envOpts.infer === "boolean") {
      // envOpts.infer is boolean
      settings.infer = envOpts.infer;
    }

    if (typeof envOpts.safe === "boolean") {
      // envOpts.safe is boolean
      settings.safe = envOpts.safe;
    }

    return settings;
  }
}
