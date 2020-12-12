import { DEFAULT_SCOPE } from "./cfg.ts";

export class DuplicateEnv extends Error {
  constructor(prop: string) {
    super(prop);
    this.message = `'${prop}' already exist`;
    this.name = "DuplicateEnv";
  }
}

export class InvalidPath extends Error {
  constructor(path: string) {
    super(path);
    this.message = `Can't find the file '${path}'`;
    this.name = "InvalidPath";
  }
}

export class ScopeOverwriteError extends Error {
  constructor(scope: string | symbol) {
    scope = String(scope);
    super(scope);
    this.message = `Scope '${scope}' already exist`;
    this.name = "ScopeOverwriteError";
  }
}

export class UndefinedFileFormat extends Error {
  constructor(path: string) {
    super(path);
    this.message = `Can't determine the format of '${path}'`;
    this.name = "UndefinedFileFormat";
  }
}

export class UnknownScopeError extends Error {
  constructor(scope: string | symbol) {
    const isDefaultScope: boolean = scope === DEFAULT_SCOPE ? true : false;
    scope = String(scope);
    super(scope);
    this.message = isDefaultScope
      ? `Cfg has not been initialized yet`
      : `Scope '${scope}' has not yet been initialized`;
    this.name = "UnknownScopeError";
  }
}
