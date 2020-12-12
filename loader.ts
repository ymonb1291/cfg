import { existsSync, resolve } from "./deps.ts";
import { DuplicateEnv, InvalidPath } from "./error.ts";
import { MarkupLanguages, parser } from "./parser.ts";

import type { Conf, Env, KeyValuePairs } from "./config.ts";
import type { Settings, Source } from "./settings.interface.ts";

export class Loader<C extends Conf, E extends Env> {
  public conf: C;
  public env: E;

  constructor(settings: Settings) {
    this.env = this.loadEnv(settings.env);
    this.exportEnv(settings.env);
    this.conf = this.loadConf(settings);
  }

  /** Exports this.env to Deno.env */
  private exportEnv(envSettings: Settings["env"]): void {
    if (!envSettings.export) return;

    for (const key in this.env) {
      if (envSettings.safe && Deno.env.get(key)) {
        throw new DuplicateEnv(key);
      } else {
        Deno.env.set(key, String(this.env[key]));
      }
    }
  }

  /** Generates the value of this.conf*/
  private loadConf(settings: Settings): C {
    const imports: Conf[] = settings.load
      .map((load) => this.unwrapConf(load));
    return Object.assign({}, ...imports);
  }

  /** Generates the value of this.env*/
  private loadEnv(envSettings: Settings["env"]): E {
    const imports: KeyValuePairs[] = envSettings.load.map((load) =>
      this.unwrapEnv(load, envSettings)
    );
    return Object.assign({}, ...imports);
  }

  /** Synchronously reads and returns the entire contents of a file as a string  */
  private readFile(path: string): [string, string] {
    let fullPath: string = resolve(path);

    // Throw error if the file doesn't exist
    if (!existsSync(fullPath)) {
      throw new InvalidPath(fullPath);
    }

    // Return content of file
    const decoder = new TextDecoder("utf-8");
    const data = Deno.readFileSync(fullPath);
    return [fullPath, decoder.decode(data)];
  }

  /**
   * Converts a load from Settings.load to a KeyValuePairs object
   *  * If load is already a KeyValuePairs object, it's returned as is.
   *  * If load is a function, the function is called.
   *  * If load is a string, the file is decoded and its content is parsed
   * @param load load from Settings.load
   */
  private unwrapConf(load: Source): Conf {
    if (typeof load === "function") {
      // load is a function
      return load(this.env);
    } else if (typeof load !== "string") {
      // load is already KeyValuePairs
      return load;
    }

    // load is a path to a file -> read the file
    const [fullPath, data] = this.readFile(load);
    // Parse file content
    return parser(data, fullPath);
  }

  /**
   * Converts a load from Settings.env.load to a KeyValuePairs object
   *  * If load is already a KeyValuePairs object, it's returned as is.
   *  * If load is a string, the file is decoded and its content is parsed
   *    using dotenv-parser
   * @param load Import from Settings.env.load
   * @param envSettings Settings.env
   */
  private unwrapEnv(
    load: string | KeyValuePairs,
    envSettings: Settings["env"],
  ): KeyValuePairs {
    if (typeof load !== "string") {
      // load is already KeyValuePairs
      return load;
    }

    // load is a path to a file -> read the file
    const [fullPath, data] = this.readFile(load);
    // decode the .env file using dotenv-parser
    return parser(data, fullPath, MarkupLanguages.ENV, envSettings.infer);
  }
}
