import { DEFAULT_ENV_EXPORT, DEFAULT_ENV_MERGE, DEFAULT_ENV_IMPORT, DEFAULT_ENV_PATH } from "./constants.ts";
import { isPlainObject } from "./utils.ts";
import { ENVConfiguration, Configuration } from "./cfg.ts";
import { Loadable } from "./loader.ts";

interface EnvOpt {
  export?: boolean;
  import?: ENVConfiguration;
  merge?: boolean;
  path?: string;
}

export interface Opts {
  env?: boolean | string | EnvOpt;
  load?: Loadable | Loadable[];
  scope?: string;
}

interface InternalEnvOptions {
  export: boolean;
  import: ENVConfiguration;
  merge: boolean;
  path: string;
}

export interface InternalOptions {
  env: InternalEnvOptions;
  loadables: Loadable[];
  scope: string;
}

export class Options {
  public constructor(private readonly raw: Opts) {}

  public get internalOptions(): InternalOptions {
    return {
      env: {
        export: this.computedEnvExportOption,
        import: this.computedEnvImportOption,
        merge: this.computedEnvMergeOption,
        path: this.computedEnvPathOption,
      },
      loadables: this.computedLoadablesOption,
      scope: this.computedScopeOption,
    };
  }

  private get computedEnvExportOption(): boolean {
    return isPlainObject(this.raw.env)
      ? (this.raw.env as EnvOpt)?.export || DEFAULT_ENV_EXPORT
      : DEFAULT_ENV_EXPORT;
  }

  private get computedEnvImportOption(): ENVConfiguration {
    return isPlainObject(this.raw.env)
      ? (this.raw.env as EnvOpt)?.import || DEFAULT_ENV_IMPORT
      : DEFAULT_ENV_IMPORT;
  }

  private get computedEnvMergeOption(): boolean {
    return isPlainObject(this.raw.env)
      ? (this.raw.env as EnvOpt)?.merge || DEFAULT_ENV_MERGE
      : DEFAULT_ENV_MERGE;
  }

  private get computedEnvPathOption(): string {
    if (!this.raw.env) {
      return "";
    } else if (typeof this.raw.env === "boolean") {
      return DEFAULT_ENV_PATH;
    } else if (typeof this.raw.env === "string") {
      return this.raw.env;
    } else {
      return this.raw.env.path == null ? DEFAULT_ENV_PATH : this.raw.env.path;
    }
  }

  private get computedLoadablesOption(): Loadable[] {
    if (!this.raw.load) return [];
    else if (Array.isArray(this.raw.load)) return this.raw.load;
    else return [this.raw.load];
  }

  private get computedScopeOption(): string {
    // scope is already computed in Cfg.init()
    return (this.raw as Required<Opts>).scope;
  }
}
