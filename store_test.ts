import { Store } from "./store.ts";
import { Rhum } from "./deps_test.ts";
import {
  ScopeOverwriteError,
  UnknownScopeError
} from "./error.ts";
import { Config } from "./config.ts";
import { Settings } from "./settings.interface.ts";

const settingsTest: Settings = {
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
  const scopeAsSymbol = Symbol(scope);

  Rhum.testSuite("get/set", () => {
    const config = new Config(settingsTest);

    Rhum.testCase("Store.prototype.set returns Config", () => {
      const res = store.set(scope, config);
      Rhum.asserts.assertEquals(res, config);
    });

    Rhum.testCase(
      "Store.prototype.set throws ScopeOverwriteError when scope exists",
      () => {
        Rhum.asserts.assertThrows(() => {
          store.set(scope, config);
        }, ScopeOverwriteError);
      },
    );

    Rhum.testCase("Store.prototype.set allows symbols", () => {
      const res = store.set(scopeAsSymbol, config);
      Rhum.asserts.assertEquals(res, config);
    });

    Rhum.testCase("Store.prototype.get returns Config", () => {
      const res = store.get(scope);
      Rhum.asserts.assertEquals(res, config);
    });

    Rhum.testCase("Store.prototype.get allows symbols", () => {
      const res = store.get(scopeAsSymbol);
      Rhum.asserts.assertEquals(res, config);
    });

    Rhum.testCase(
      "Store.prototype.get throws UnknownScopeError when scope doesn't exists",
      () => {
        Rhum.asserts.assertThrows(() => {
          store.get(scope + "_");
        }, UnknownScopeError);
      },
    );
  });

  Rhum.testSuite("Store.prototype.has", () => {
    Rhum.testCase("Returns 'true' when scope exists", () => {
      const res = store.has(scope);
      Rhum.asserts.assert(res);
    });

    Rhum.testCase("Returns 'false' when scope doesn't exists", () => {
      const res = store.has(scope + "_");
      Rhum.asserts.assert(!res);
    });

    Rhum.testCase("Store.prototype.has allows symbols", () => {
      const res = store.has(scopeAsSymbol);
      Rhum.asserts.assert(res);
    });
  });
});

Rhum.run();
