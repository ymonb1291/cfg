import { Cfg } from "../cfg.ts";

/**
 * --- Preparation ---
 * Let's define some configurations that will be used through this example.
 * In this example, we are accessing deeply nested properties in our configuration
 */

const carColor = {
  cars: {
    Tesla: {
      Model3: ["green", "black"],
      ModelX: "blue",
      ModelY: "red",
    },
  },
};

// And this is the type
type CarColor = typeof carColor;

/**
 * --- Initialization ---
 */
let colors = Cfg<CarColor>([carColor]);

/**
 * --- Usage ---
 */

// Let's say we want to know the color of our cars?
console.log(colors.get("cars", "Tesla", "ModelX")); // -> "blue"

// Let's do the same with getp(), it's a little bit different
console.log(colors.getp("cars.Tesla.ModelY")); // -> "red"

// What if we want the color of our Audi? Oh wait, we don't have an Audi!
console.log(colors.getp("cars.Audi.A5")); // -> undefined

/**
 * --- Accessing Arrays ---
 */
console.log(colors.get("cars", "Tesla", "Model3", 1)); // -> "black"
console.log(colors.getp("cars.Tesla.Model3.0")); // -> "green"

// With getp(), you may also use brackets
console.log(colors.getp("cars[Tesla]Model3[0]")); // -> "green"
