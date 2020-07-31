import { FileSystem } from "./filesystem.ts";
import { InternalOptions } from "./options.ts";
import { Parser } from "./parser.ts";
import { ENVConfiguration, Configuration } from "./cfg.ts";

export type Loadable = string | Configuration | ((env: ENVConfiguration) => Configuration);

export class Loader {
  constructor(private readonly internalOptions: InternalOptions) {}

  public load(): [Configuration, ENVConfiguration] {
    const env: ENVConfiguration = this.getEnv();
    const configurations = this.getConfigurations(env);
    let configuration = this.mergeConfigurations(configurations);
    return [this.mergeEnv(configuration, env), env];
  }

  private get envFile(): ENVConfiguration {
    const filesystem = new FileSystem();
    const data = filesystem.readFile(this.internalOptions.env.path);
    const parser = new Parser();
    return parser.parse(data, this.internalOptions.env.path, "ENV") as ENVConfiguration;
  }

  private exportEnv(env: ENVConfiguration): void {
    if (!this.internalOptions.env.export) return;

    for (let prop in env) {
      if (!Deno.env.get(prop)) {
        Deno.env.set(prop, String(env[prop]));
      }
    }
  }

  private getEnv(): ENVConfiguration {
    const env = Object.assign(this.envFile, this.internalOptions.env.import);
    this.exportEnv(env);
    return env;
  }

  private configuration(pathToFile: string): Configuration {
    const filesystem = new FileSystem();
    const data = filesystem.readFile(pathToFile);
    const parser = new Parser();
    return parser.parse(data, pathToFile) as Configuration;
  }

  private getConfigurations(env: ENVConfiguration): Configuration[] {
    return this.internalOptions.loadables.map((loadable) => {
      if (typeof loadable === "string") {
        return this.configuration(loadable);
      } else if (typeof loadable === "function") {
        return loadable(env);
      } else {
        return loadable;
      }
    });
  }

  private mergeConfigurations(configurations: Configuration[]): Configuration {
    return Object.assign({}, ...configurations);
  }

  private mergeEnv(configuration: Configuration, env: ENVConfiguration): Configuration {
    if (this.internalOptions.env.merge) {
      return Object.assign({}, configuration, env);
    }
    return configuration;
  }
}
