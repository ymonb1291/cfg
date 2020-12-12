import { Store } from "./store.ts";
import { assert, assertEquals, assertThrows, Rhum } from "./deps_test.ts";
import { ScopeOverwriteError, UnknownScopeError } from "./error.ts";
import { Config } from "./config.ts";
import { Settings } from "./settings.interface.ts";

const settings_test: Settings = {
  env: {
    export: false,
    infer: false,
    load: [],
    safe: true,
  },
  load: [],
  scope: "settings_test",
};

Rhum.testPlan("store.ts", () => {
  const store = new Store();
  const scope = "test|Store|get/set";
  const scope_symbol = Symbol(scope);

  Rhum.testSuite("get/set", () => {
    const config = new Config(settings_test);

    Rhum.testCase("Store.prototype.set returns Config", () => {
      const res = store.set(scope, config);
      assertEquals(res, config);
    });

    Rhum.testCase(
      "Store.prototype.set throws ScopeOverwriteError when scope exists",
      () => {
        assertThrows(() => {
          store.set(scope, config);
        }, ScopeOverwriteError);
      },
    );

    Rhum.testCase("Store.prototype.set allows symbols", () => {
      const res = store.set(scope_symbol, config);
      assertEquals(res, config);
    });

    Rhum.testCase("Store.prototype.get returns Config", () => {
      const res = store.get(scope);
      assertEquals(res, config);
    });

    Rhum.testCase("Store.prototype.get allows symbols", () => {
      const res = store.get(scope);
      assertEquals(res, config);
    });

    Rhum.testCase(
      "Store.prototype.get throws UnknownScopeError when scope doesn't exists",
      () => {
        assertThrows(() => {
          store.get(scope + "_");
        }, UnknownScopeError);
      },
    );
  });

  Rhum.testSuite("Store.prototype.has", () => {
    Rhum.testCase("Returns 'true' when scope exists", () => {
      const res = store.has(scope);
      assert(res);
    });

    Rhum.testCase("Returns 'false' when scope doesn't exists", () => {
      const res = store.has(scope + "_");
      assert(!res);
    });
  });
});

Rhum.run();
