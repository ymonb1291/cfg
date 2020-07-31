import { ERROR_NAME_PREFIX } from "./constants.ts";

export class ErrorHandler {
  constructor(name: string, message: string) {
    const error = new Error(message);
    error.name = name.toUpperCase();
    throw error;
  }

  public static print(error: Error): void {
    error.name = error.name === "Error" ? "UNKNOWN" : error.name;
    error.name = `${ERROR_NAME_PREFIX} [${error.name}]`;
    console.error(error);
  }
}
