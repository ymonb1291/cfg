import { ENVConfiguration, Configuration } from "./cfg.ts";

export const DEFAULT_ENV_EXPORT: boolean = false;
// TODO: DEFAULT_ENV_IMPORT must be empty for release
export const DEFAULT_ENV_IMPORT: ENVConfiguration = { __DEFAULT_ENV: "CONFIGURATION" };
export const DEFAULT_ENV_MERGE: boolean = false;
export const DEFAULT_ENV_PATH: string = ".env";
// TODO: DEFAULT_LOADABLE must be empty for release
export const DEFAULT_LOADABLE: Configuration = { __DEFAULT: "CONFIGURATION" };
export const DEFAULT_SCOPE: string = "_DEFAULT";
