import type { ENV } from "../types/env.type.ts";
import type { SourceFn } from "../../mod.ts";

export const server: SourceFn = (env: ENV) => ({
  url: `${env.PROTOCOL}://${env.HOST}`,
});
