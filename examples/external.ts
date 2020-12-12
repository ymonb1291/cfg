import { Cfg } from "../cfg.ts";
import { server } from "./configs/server.ts";
import { Customers } from "./types/customers.type.ts";
import { ENV } from "./types/env.type.ts";
import { Fruits } from "./types/fruits.type.ts";
import { Library } from "./types/library.type.ts";
import { Server } from "./types/server.type.ts";

/**
 * --- Initialization ---
 * Here, we are loading an .env file and external configurations in different formats.
 */
let cfg = Cfg<
  Customers & Fruits & Library & Server,
  ENV
>({
  env: {
    load: "./configs/.env",
  },
  load: [
    "./configs/customers.toml",
    "./configs/fruits.json",
    "./configs/library.yml",
    server,
  ],
});

/**
 * --- Usage ---
 */
console.log(cfg.get("customers", 0, "name")); // -> "Francesco Suarez"
console.log(cfg.get("fruits", 1)); // -> "orange"
console.log(cfg.get("books", 2, "title")); // -> "The Great Gatsby"
console.log(cfg.get("url")); // -> "https://127.0.0.1"
