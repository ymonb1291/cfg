// Command: $ deno run --unstable --allow-read --allow-env ./env.ts
import cfg, { Opts } from "../mod.ts";
import { ENV } from "./types/env.ts";
import { server } from "./configs/server.ts";
import { Server } from "./types/server.ts";

const opts: Opts = {
  env: {
    export: true,
    path: "./configs/.env",
  },
  load: server,
  scope: "myConfig",
};

const config = cfg<Server, ENV>(opts);

console.log(config.get("url")); // -> outputs "https://127.0.0.1"
console.log(config.getEnv("HOST")); // -> outputs "127.0.0.1"
console.log(Deno.env.get("HOST")); // -> outputs "127.0.0.1", undefined if option export is not true
