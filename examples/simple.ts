import { Cfg } from "../cfg.ts";

/**
 * --- Preparation ---
 * Let's define some configurations that will be used through this example.
 * These two configurations will form the base of our configuration
 */

// c1 is a plain object and c2 is a function that returns a similar object
const c1 = { a: "A" };
const c2 = () => ({ b: "B" });

// And these are the types of both plain objects
type C1 = typeof c1;
type C2 = ReturnType<typeof c2>;

/**
 * --- Initialization of Cfg ---
 * Both objects are loaded into Cfg
 */
let simple_config = Cfg<C1 & C2>([c1, c2]);

/**
 * --- Usage ---
 * You may use the get() or the getp() method to access the configuration.
 * Both seem to be equivalent for such simple example.
 * Check examples/deep.ts to see the difference
 */
console.log(simple_config.get("a")); // -> "A"
console.log(simple_config.getp("a")); // -> "A"

/**
 * --- Persistance ---
 * Cfg configurations are persistants. You may access them from anywhere.
 */
let my_config = Cfg<C1 & C2>();
// We have loaded the configuration from above. Now we can access it
console.log(my_config.get("a")); // -> "A"
console.log(my_config.getp("b")); // -> "B"
