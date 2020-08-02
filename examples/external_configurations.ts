// Command: $ deno run --unstable --allow-read ./external_configurations.ts
import cfg from "../mod.ts";
import { customers } from "./configs/customers.ts";
import { Customers } from "./types/customers.ts";
import { Library } from "./types/library.ts";

const config = cfg<Library & Customers>({
  // here we are importing a YAML file and a function that returns a plain object
  // we can also import plain objects, and JSON/TOML files
  load: ["./configs/library.yml", customers],
});

console.log(config.get("books")); // -> outputs the collection of books
console.log(config.get("customers")); // -> outputs the list of customers
