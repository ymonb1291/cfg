import { Configuration } from "./store.ts";
import { ENVConfiguration } from "./cfg.ts";

export const DEFAULT_ENV_EXPORT: boolean = false;
export const DEFAULT_ENV_IMPORT: ENVConfiguration = { DEFAULT_ENV: true };
export const DEFAULT_ENV_MERGE: boolean = false;
export const DEFAULT_ENV_PATH: string = ".env";
export const DEFAULT_LOADABLE: Configuration = { defaultLoadable: 123 };
export const DEFAULT_SCOPE: string = "_DEFAULT";
