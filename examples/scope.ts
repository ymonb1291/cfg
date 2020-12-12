import { Cfg } from "../cfg.ts";

/**
 * --- Preparation ---
 * Let's define some configurations that will be used through this example.
 * In this example, we are creating 2 configurations on different scopes
 */

const foo = { foo: "FOO" };
const bar = { bar: "BAR" };

// And these are the types of both configurations
type Foo = typeof foo;
type Bar = typeof bar;

/**
 * --- Initialization ---
 */
// foo is added on the default scope
Cfg([foo]);
// bar is added on the "bar" scope
Cfg("bar", [bar]);

/**
 * --- Usage ---
 * Let's pretend we are in another module and we want to access these configurations
 */

// Let's call the instances
let fooConfig = Cfg<Foo>();
let barConfig = Cfg<Bar>("bar");

// And now we can access our configurations
console.log(fooConfig.get("foo")); // -> "FOO"
console.log(barConfig.get("bar")); // -> "BAR"
