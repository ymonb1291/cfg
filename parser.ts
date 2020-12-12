import { dotEnvParser, parse, parseTOML, parseYAML } from "./deps.ts";
import { UndefinedFileFormat } from "./error.ts";

import type { KeyValuePairs } from "./config.ts";

/** Any element listed in enum MarkupLanguages */
type MarkupLanguage =
  | MarkupLanguages.ENV
  | MarkupLanguages.JSON
  | MarkupLanguages.TOML
  | MarkupLanguages.YAML;

/** Lists all formats that can be parsed.  */
export enum MarkupLanguages {
  ENV = "ENV",
  JSON = "JSON",
  TOML = "TOML",
  YAML = "YAML",
}

/** Parses the content of a file and returns the KeyValuePairs object */
export function parser(data: string, path: string): KeyValuePairs;
/** Parses the content of a file and returns the KeyValuePairs object */
export function parser(
  data: string,
  path: string,
  format: MarkupLanguage,
): KeyValuePairs;
/** Parses the content of a file and returns the KeyValuePairs object */
export function parser(
  data: string,
  path: string,
  infer: boolean,
): KeyValuePairs;
/** Parses the content of a file and returns the KeyValuePairs object */
export function parser(
  data: string,
  path: string,
  format: MarkupLanguage,
  infer: boolean,
): KeyValuePairs;
export function parser(
  data: string,
  path: string,
  arg2?: MarkupLanguage | boolean,
  infer?: boolean,
): KeyValuePairs {
  /** Guesses the markup language based on the extension of the file */
  function inferLanguage(): MarkupLanguage {
    const parsedPath = parse(path);

    if (parsedPath.ext === "" && parsedPath.base.toLowerCase() === ".env") {
      // If the file is named .env
      return MarkupLanguages.ENV;
    }

    switch (parsedPath.ext.toLowerCase()) {
      case ".yml":
      case ".yaml":
        return MarkupLanguages.YAML;
      case ".toml":
        return MarkupLanguages.TOML;
      case ".json":
        return MarkupLanguages.JSON;
      case ".env":
        return MarkupLanguages.ENV;
      default:
        throw new UndefinedFileFormat(path);
    }
  }

  let format: MarkupLanguage | void;
  if (typeof arg2 === "string") format = arg2;
  else if (typeof arg2 === "boolean") infer = arg2;

  if (!format) {
    format = inferLanguage();
  }

  if (!infer) infer = false;

  switch (format) {
    case MarkupLanguages.JSON:
      return JSON.parse(data);
    case MarkupLanguages.TOML:
      return parseTOML(data) as KeyValuePairs;
    case MarkupLanguages.YAML:
      return parseYAML(data) as KeyValuePairs;
    default:
      return dotEnvParser(data, infer);
  }
}
