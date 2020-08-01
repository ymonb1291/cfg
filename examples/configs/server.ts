import { ConfigFunction } from "../../mod.ts";

export type ENV = {
  PROTOCOL: "http" | "https";
  HOST: string;
};

export type Server = {
  url: string;
};

export const server: ConfigFunction<ENV> = (env: ENV) => ({
  url: `${env.PROTOCOL}://${env.HOST}`,
});
