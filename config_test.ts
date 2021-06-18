import { Rhum } from "./deps_test.ts";
import {
  deleteFile,
  writeFile,
} from "./test.utils.ts";
import Cfg from "./mod.ts";

Rhum.testPlan("config.ts", () => {
  Rhum.testSuite("Config.prototype.get()", () => {
    Rhum.testCase("Returns the value of a 4th level property", () => {
      const obj = { level1: { level2: { level3: { level4: true } } } };
      const cfg = Cfg<typeof obj>("CONFIG_TEST_GET1", [obj]);
      const value = cfg.get("level1", "level2", "level3", "level4");
      Rhum.asserts.assert(value);
    });

    Rhum.testCase("Can access properties of arrays", () => {
      const obj = { prop: [0, 1] };
      const cfg = Cfg<typeof obj>("CONFIG_TEST_GET2", [obj]);
      const value = cfg.get("prop", 1);
      Rhum.asserts.assert(value);
    });
  });

  Rhum.testSuite("Config.prototype.env()", () => {
    Rhum.testCase("Returns a the entire env without parameter", () => {
      const dotEnv = `KEY=VALUE`;
      const FILENAME = ".env";
      writeFile(FILENAME, dotEnv);
      const cfg = Cfg<Record<string, string>, { KEY: "VALUE" }>({
        env: {
          load: FILENAME,
        },
        load: {},
        scope: "CONFIG_TEST_ENV1",
      });
      deleteFile(FILENAME);

      const value = cfg.env();
      Rhum.asserts.assertEquals(value, { KEY: "VALUE" });
    });

    Rhum.testCase("Returns a specific value", () => {
      const dotEnv = `KEY=VALUE`;
      const FILENAME = ".env";
      writeFile(FILENAME, dotEnv);
      const cfg = Cfg<Record<string, string>, { KEY: "VALUE" }>({
        env: {
          load: FILENAME,
        },
        load: {},
        scope: "CONFIG_TEST_ENV2",
      });
      deleteFile(FILENAME);

      const value = cfg.env("KEY");
      Rhum.asserts.assertEquals(value, "VALUE");
    });
  });

  Rhum.testSuite("Config.prototype.getp()", () => {
    Rhum.testCase(
      "Returns the value of a 4th level property using dot notation",
      () => {
        const obj = { level1: { level2: { level3: { level4: true } } } };
        const cfg = Cfg<typeof obj>("CONFIG_TEST_GETP1", [obj]);
        const value = cfg.getp("level1.level2.level3.level4");
        Rhum.asserts.assert(value);
      },
    );

    Rhum.testCase("Can access properties of arrays using dot notation", () => {
      const obj = { prop: [0, 1] };
      const cfg = Cfg<typeof obj>("CONFIG_TEST_GETP2", [obj]);
      const value = cfg.getp("prop.1");
      Rhum.asserts.assert(value);
    });

    Rhum.testCase(
      "Returns the value of a 4th level property using brackets notation",
      () => {
        const obj = { level1: { level2: { level3: { level4: true } } } };
        const cfg = Cfg<typeof obj>("CONFIG_TEST_GETP3", [obj]);
        const value = cfg.getp("level1[level2][level3][level4]");
        Rhum.asserts.assert(value);
      },
    );

    Rhum.testCase(
      "Can access properties of arrays using brackets notation",
      () => {
        const obj = { prop: [0, 1] };
        const cfg = Cfg<typeof obj>("CONFIG_TEST_GETP4", [obj]);
        const value = cfg.getp("prop[1]");
        Rhum.asserts.assert(value);
      },
    );
  });
});

Rhum.run();
