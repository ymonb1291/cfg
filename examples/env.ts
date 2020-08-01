// Command: $ deno run --unstable --allow-read --allow-env ./persistance.ts
import cfg from "../mod.ts";
import { server, ENV, Server } from "./configs/server.ts";

const config = cfg<Server, ENV>({
  env: {
    export: true,
    path: "./configs/.env",
  },
  load: server,
  scope: "myConfig",
});

console.log(config.get("url")); // -> outputs "https://127.0.0.1"
console.log(config.getEnv("HOST")); // -> outputs "127.0.0.1"
console.log(Deno.env.get("HOST")); // -> outputs "127.0.0.1", undefined if option export is not true
