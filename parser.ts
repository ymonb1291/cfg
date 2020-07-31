import { parse, parseTOML, parseYAML } from "./depts.ts";
import { ENVParser } from "./envparser.ts";
import { ErrorHandler } from "./error.ts";

type ENV = "ENV" | "env";
type JSON = "JSON" | "json";
type TOML = "TOML" | "toml";
type YAML = "YAML" | "yaml" | "YML" | "yml";
type MarkupLanguage = ENV | JSON | TOML | YAML;

enum MarkupLanguages {
  ENV = "ENV",
  JSON = "JSON",
  TOML = "TOML",
  YAML = "YAML",
  YML = "YML",
}

export class Parser {
  // TODO: We are only using the language argument for "ENV". Why does MarkupLanguage support
  // upper and lower cases then? It should be attempted to let the end user specify the language.
  // But can TS differenciate an object such as {path: "abc.yml", lang: "YAML"} with Configuration?
  public parse(data: string, pathToFile: string, language?: MarkupLanguage): unknown {
    const lang = language || String(this.inferLanguage(pathToFile));

    switch (lang.toUpperCase()) {
      case MarkupLanguages.ENV.toUpperCase():
        return this.parseAsENV(data, pathToFile);
      case MarkupLanguages.JSON.toUpperCase():
        return this.parseAsJSON(data, pathToFile);
      case MarkupLanguages.TOML.toUpperCase():
        return this.parseAsTOML(data, pathToFile);
      case MarkupLanguages.YAML.toUpperCase():
      case MarkupLanguages.YML.toUpperCase():
        return this.parseAsYAML(data, pathToFile);
      default:
        throw new ErrorHandler("UNKNOWN_LANGUAGE", `Unknown language in ${pathToFile}`);
    }
  }

  private inferLanguage(pathToFile: string): MarkupLanguage | void {
    const path = parse(pathToFile);

    if (path.ext === "" && path.base.toLowerCase() === ".env") {
      return MarkupLanguages.ENV;
    }

    switch (path.ext.toLowerCase()) {
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
        return void 0;
    }
  }

  private parseAsENV(data: string, pathToFile: string): unknown {
    try {
      const envParser = new ENVParser();
      return envParser.parse(data);
    } catch (error) {
      throw new ErrorHandler("UNEXPECTED_PARSER_ENV", `An unexpected error occured when parsing ${pathToFile}`);
    }
  }

  private parseAsJSON(data: string, pathToFile: string): unknown {
    try {
      return JSON.parse(data);
    } catch (error) {
      throw new ErrorHandler("UNEXPECTED_PARSER_JSON", `An unexpected error occured when parsing ${pathToFile}`);
    }
  }

  private parseAsTOML(data: string, pathToFile: string): unknown {
    try {
      return parseTOML(data);
    } catch (error) {
      throw new ErrorHandler("UNEXPECTED_PARSER_TOML", `An unexpected error occured when parsing ${pathToFile}`);
    }
  }

  private parseAsYAML(data: string, pathToFile: string): unknown {
    try {
      return parseYAML(data);
    } catch (error) {
      throw new ErrorHandler("UNEXPECTED_PARSER_YAML", `An unexpected error occured when parsing ${pathToFile}`);
    }
  }
}
