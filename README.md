# Cfg
![GitHub tag (latest SemVer pre-release)](https://img.shields.io/github/v/tag/ymonb1291/cfg?include_prereleases&style=flat-square)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/ymonb1291/cfg?style=flat-square)
![GitHub](https://img.shields.io/github/license/ymonb1291/cfg?style=flat-square)

**Cfg** is a configuration handler for **Deno** with support for `.env` and `scopes`.

# Run

Some features require access to the file system and the environment. Please run your project with the flags `--allow-read`, `--allow-env` and `--unstable`.

# Import

Import the latest release.

```
// As named import
import { cfg } from "https://deno.land/x/cfg@v1.0.0-beta.3/mod.ts";

// Or as default import
import cfg from "https://deno.land/x/cfg@v1.0.0-beta.3/mod.ts";
```

# Basic usage

This is the easiest way to use **Cfg**.

```
const config = cfg([{ foo: "bar" }]);

console.log(config.get("foo"))
// Or
console.log(config.getp("foo"))
```

A type parameter can also be used in order to benefit from intellisense.

```
const obj = { foo: "bar" };

const config = cfg<typeof obj>([obj]);

console.log(config.get("foo"));
// Or
console.log(config.getp("foo"))
```

# Usage

## cfg() function

`cfg` is an overloaded function. It has the following signature:

```
cfg<Config extends Configuration, Env extends ENVConfiguration = {}>(arguments): Cfg<Config, Env>
```

### Call without argument

Calling `cfg()` without arguments is used to access a configuration which has already been initiated on the default scope

### Call with a scope

Calling `cfg(scope)` is used to access a configuration which has already been initiated on the specified scope

### Call with a `Loadable`

Calling `cfg([Loadable])` is used to create a configuration on the default scope. An array of `Loadable` is passed as argument. `Loadable` is the type that describes anything that can loaded to the configuration.

### Call with a scope and a `Loadable`

Calling `cfg(scope, [Loadable])` is used to create a configuration on the specified scope.

### Call with an options object

Calling `cfg(options)` allow to specify additional options

## Persistance & scopes

All configurations are stored by **Cfg** and can be accessed at any time by calling `cfg(scope)`. There are a few things to keep in mind:

- When no scope is specified in the options, a default scope is used.
- Scopes are shared between modules. It's therefore best for each module to have its own scope and leave the default scope for the final user.
- Only one configuration per scope can be created. Once it's there, it can't be deleted

# Options

The `Opts` interface describes the option object that is used to configure `cfg()`.

```
interface Opts {
  env?: boolean | string | EnvOpt;
  load?: Loadable | Loadable[];
  scope?: string;
}
```

The `Opts.scope` property defines the scope. The `Opts.load` property is used to specify one or several `Loadable` which will be merged to a `Configuration` object. The `Opts.env` property is used to configure the environment variables.
When `Opts.env` is `true`, **Cfg** will look for an `.env` file in the root directory. `Opts.env` can also be a string that represents the path to the `.env` file. More options can be configured by using an `EnvOpt` object.

```
interface EnvOpt {
  export?: boolean;
  import?: ENVConfiguration;
  merge?: boolean;
  path?: string;
}
```

When `true`, `EnvOpt.export` exports the environment variables to `Deno.env`. It will never overwrite a value that already exist.
With `EnvOpt.import`, an object of type `ENVConfiguration` can be imported. This can be useful if, for example, one needs to use another parser for `.env` files. When true, `EnvOpt.merge` will merge the environment variables with the configuration. Finally, `EnvOpt.path` is a string that that represents the path to the `.env` file.

# Methods

## Cfg.get(...props: string[])

This method returns the configuration. Parameters can be used to return a specific property. When `cfg()` is called with a type parameter, intellisense checks that the paramters are correct and knows the type of the value returned.

`Cfg.get()` allows up to 4 parameters.

## Cfg.getp(path: string)

This method returns the configuration just like `Cfg.get()`. But it accepts a path as parameter with the syntax `a.b.c` or `a[b][c]`. This method will always return a value with type unknown.

## Cfg.getEnv(prop: string)

`Cfg.getEnv()` is similar to `Cfg.get()` except that it accepts only one parameter and returns environment variables.

# Types

## Configuration

The interface `Configuration` defines the configuration object.

```
interface Configuration {
  [key: string]: (string | number | boolean | Configuration) | (string | number | boolean | Configuration)[];
}
```

## ENVConfiguration

The interface `ENVConfiguration` defines the `.env` object

```
interface ENVConfiguration {
  [key: string]: string | number | boolean;
}
```

## Loadable

The type `Loadable` defines the sources of configuration that will be merged to a `Configuration` object.

```
type Loadable = string | Configuration | ConfigFunction;
```

## ConfigFunction

The type `ConfigFunction` defines a function that returns a `Configuration` object.

```
type ConfigFunction<T extends ENVConfiguration = {}> = (env: T) => Configuration;
```

# Contributions

PRs are welcome!
