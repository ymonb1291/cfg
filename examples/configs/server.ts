import { Server } from "../types/server.ts";
import { ENV } from "../types/env.ts";
import { ConfigFunction } from "../../loader.ts";

export const server: ConfigFunction = (env: ENV) => ({
  url: `${env.PROTOCOL}://${env.HOST}`,
});
