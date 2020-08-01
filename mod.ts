// Export factory function as default and named export
import { cfg } from "./factory.ts";
export default cfg;
export { cfg } from "./factory.ts";

// Other exports
export { Configuration, ENVConfiguration } from "./cfg.ts";
export { ConfigFunction } from "./loader.ts";
export { Opts } from "./options.ts";
