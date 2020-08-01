// Command: $ deno run --unstable ./basic.ts
import cfg from "../mod.ts";

// Define the type of the configuration
type MyConfig = {
  foo: {
    bar: string;
  };
};

// Declare the configuration
const myConfig: MyConfig = {
  foo: {
    bar: "baz",
  },
};

// Call cfg() using an optional type argument
const config = cfg<MyConfig>([myConfig]);

// Retreive your config using Cfg.get()
// The return type is infered and intellisense knows which properties exist
// This function can't be used if you didn't provide cfg() with a type argument
console.log(config.get()); // -> outputs {foo: { bar: "baz" } } of type MyConfig
console.log(config.get("foo", "bar")); // -> outputs "baz" of type string
// console.log(config.get("unknown", "bar")); -> doesn't compile

// Retreive your config using Cfg.getp()
// The return type is always unknown
console.log(config.getp()); // -> outputs {foo: { bar: "baz" } } of type unknown
console.log(config.getp("foo.bar")); // -> outputs "baz" of type unknown
console.log(config.getp("foo[bar]")); // -> outputs "baz" of type unknown
console.log(config.getp("unknown.bar")); // -> outputs undefined
