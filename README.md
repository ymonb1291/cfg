# Cfg
![ci](https://github.com/ymonb1291/cfg/workflows/ci/badge.svg)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/ymonb1291/cfg?include_prereleases)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/ymonb1291/cfg?style=flat-square)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/cfg/mod.ts)
![GitHub](https://img.shields.io/github/license/ymonb1291/cfg?style=flat-square)

[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/cfg)

Configuration handler for **Deno** with support for `.env` and `scopes`.


Some features require access to the file system and the environment. Please run your project with the flags `--allow-read` and `--allow-env`.

# Getting started

Import the latest release.
```
// From Deno.land
import { Cfg } from "https://deno.land/x/cfg/mod.ts";
// From Nest.land
import { Cfg } from "https://x.nest.land/cfg/mod.ts";
// From Denopkg
import { Cfg } from "https://denopkg.com/ymonb1291/cfg/mod.ts";
// From Github
import { Cfg } from "https://raw.githubusercontent.com/ymonb1291/cfg/master/mod.ts";
```

Create and import the configuration
```
// Create
const myConfig = {fruit: "Orange"};
// Import
const cfg = Cfg<typeof myConfig>([myConfig]);
```

Access properties
```
console.log(cfg.get("fruit")); // -> "Orange"
```

# Cfg function
`Cfg()` is an overloaded function with the following signature:
```
function Cfg<Conf, Env>(): Config<Conf, Env>;
function Cfg<Conf, Env>(scope: string): Config<Conf, Env>;
function Cfg<Conf, Env>(load: Source[]): Config<Conf, Env>;
function Cfg<Conf, Env>(scope: string, load: Source[]): Config<Conf, Env>;
function Cfg<Conf, Env>(options: Options): Config<Conf, Env>;
```
### Calling `Cfg()` without argument
Calling `Cfg()` without argument is used to access the `Config` registered on the default scope. If the default scope has not been initialized, an `UnknownScopeError` is thrown.

### Calling `Cfg()` with a scope
Calling `Cfg(scope: string)` is used to access the `Config` registered on a non-default scope. If the scope has not been initialized, an `UnknownScopeError` is thrown.

### Calling `Cfg()` with sources
Calling `Cfg(load: Source[])` is used to register a `Config` on the default scope. If the default scope has already been registed, a `ScopeOverwriteError` is thrown.

### Calling `Cfg()` with a scope and sources
Calling `Cfg(scope: string, load: Source[])` is used to register a `Config` on a non-default scope. If the scope has already been registed, a `ScopeOverwriteError` is thrown.

### Calling `Cfg()` with options
Calling `Cfg(options: Options)` is used to register a `Config` with an option object. Initialization with `Options` is typically used if you want to use an `.env` file. If the scope has already been registed, a `ScopeOverwriteError` is thrown.

# Persistance & scopes

All configurations are persistant, they are stored by `Cfg` in the background and can be accessed from anywhere in your application. They are not private and can be accessed by other modules.

Scopes are like namespaces. They allow the developper to segregate configurations. When developping a module, you should use scopes!

# Methods

## Cfg.prototype.get(...props: string[])

This method returns the configuration or one of its properties. Don't forget the type parameters when calling `Cfg()` or you might have errors.

`Cfg.prototype.get()` allows up to 4 parameters.

## Cfg.prototype.getp(path: string)

This method returns the configuration just like `Config.prototype.get()`. But it accepts a path as parameter with the syntax `a.b.c` or `a[b][c]`. This method will always return a value with type unknown. Type parameters are not required when using `getp()`

## Cfg.prototype.env(prop: string)

`Config.prototype.env()` is similar to `Config.prototype.get()` except that it accepts only one parameter and returns environment variables.

# Options
The `Option` interfaces describes an object that can be used to configure `Cfg`.
```
interface Options {
  env?: boolean | EnvOptions;
  load?: Source | Source[];
  scope?: string | symbol;
}
```
Property|Type|Default|Description
---|---|---|---
`env`|boolean \| EnvOptions|false|Allows to use `.env` files
`load`|Source \| Source[] | [] | Specifies the configurations to be loaded. Can be objects, functions or external files
`scope`|string|Symbol("DEFAULT")|Specifies the scope

The `EnvOptions` interface describes the configuration for `.env` files.
```
interface EnvOptions {
  export?: boolean;
  infer?: boolean;
  load?: string | Conf | (string | Conf)[]
  safe?: boolean;
}
```
Property|Type|Default|Description
---|---|---|---
`export`|boolean|false|All key/value pairs will be exported to `Deno.env`
`infer`|boolean|false|By default, all values are string. When `true`, the parser will try to convert numbers and booleans to their primitive types. 
`load`|string \| Conf \| (string \| Conf)[]|".env"| Specifies the path to the `.env` file(s) to be loaded.
`safe`|boolean|true|If `export` is enabled, this option will prevent overwriting in ``Deno.env`

# Contributions

PRs are welcome!