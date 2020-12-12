import Cfg from "./mod.ts";
import { assert, assertEquals, assertThrows, Rhum } from "./deps_test.ts";
import { Config } from "./config.ts";
import { deleteFile, writeFile } from "./loader_test.ts";
import { DuplicateEnv } from "./error.ts";

function createDotEnv(
  filename: string = ".env",
  content: string = "NUMBER=123",
) {
  writeFile(filename, content);
}
function deleteDotEnv(filename: string = ".env") {
  deleteFile(filename);
}

const DEFAULT_CFG = { a: "A" };
const CUSTOM_SCOPE = "CUSTOM_SCOPE";
const CUSTOM_CFG = { CUSTOM: "CFG" };

Rhum.testPlan("cfg.ts", () => {
  Rhum.testSuite("Cfg(load)", () => {
    Rhum.testCase("Returns an instance of Config", () => {
      const cfg = Cfg([DEFAULT_CFG]);
      assert(cfg instanceof Config);
    });
  });

  Rhum.testSuite("Cfg(scope, load)", () => {
    Rhum.testCase("Creates a custom scope", () => {
      const scope = CUSTOM_SCOPE;
      Cfg(scope, [CUSTOM_CFG]);
    });
  });

  Rhum.testSuite("Cfg()", () => {
    Rhum.testCase("Loads the default scope", () => {
      const cfg = Cfg();

      assertEquals(cfg.get(), DEFAULT_CFG);
    });
  });

  Rhum.testSuite("Cfg(scope)", () => {
    Rhum.testCase("Loads a custom scope", () => {
      const cfg = Cfg(CUSTOM_SCOPE);
      assertEquals(cfg.get(), CUSTOM_CFG);
    });
  });

  Rhum.testSuite("Cfg(options)", () => {
    Rhum.testCase("Env is empty when Options.env = 'false'", () => {
      const cfg = Cfg<any, { NUMBER: any }>({
        env: false,
        load: {},
        scope: "CFG_OPTS_ENV_FALSE",
      });
      assert(!cfg.env("NUMBER"));
    });

    Rhum.testCase("File '.env' is loaded when Options.env = 'true'", () => {
      createDotEnv();
      const cfg = Cfg<any, { NUMBER: any }>({
        env: true,
        load: {},
        scope: "CFG_OPTS_ENV_TRUE",
      });
      deleteDotEnv();
      assert(cfg.env("NUMBER"));
    });

    Rhum.testCase("Export is 'false' when Options.env = 'true'", () => {
      createDotEnv();
      const cfg = Cfg({
        env: true,
        load: {},
        scope: "CFG_OPTS_ENV_TRUE_EXPORT",
      });
      deleteDotEnv();
      assert(!Deno.env.get("NUMBER"));
    });

    Rhum.testCase("Infer is 'false' when Options.env = 'true'", () => {
      createDotEnv();
      const cfg = Cfg<any, { NUMBER: any }>({
        env: true,
        load: {},
        scope: "CFG_OPTS_ENV_TRUE_INFER",
      });
      deleteDotEnv();
      assertEquals(cfg.env("NUMBER"), "123");
    });

    Rhum.testCase(
      "Options.load allows to customize the dotenv filename",
      () => {
        createDotEnv("x.env");
        const cfg = Cfg<any, { NUMBER: any }>({
          env: {
            load: "x.env",
          },
          load: {},
          scope: "CFG_OPTS_ENV_LOAD",
        });
        deleteDotEnv("x.env");
        assertEquals(cfg.env("NUMBER"), "123");
      },
    );

    Rhum.testCase("Options.load allows to merge multiple files", () => {
      createDotEnv();
      createDotEnv("x.env", "HELLO=WORLD");
      const cfg = Cfg<any, { NUMBER: any; HELLO: string }>({
        env: {
          load: [".env", "x.env"],
        },
        load: {},
        scope: "CFG_OPTS_ENV_LOAD_MULTI",
      });
      deleteDotEnv();
      deleteDotEnv("x.env");
      assertEquals(cfg.env("NUMBER"), "123");
      assertEquals(cfg.env("HELLO"), "WORLD");
    });

    Rhum.testCase("Options.infer tries to guess the type of the values", () => {
      createDotEnv();
      const cfg = Cfg<any, { NUMBER: any }>({
        env: {
          infer: true,
        },
        load: {},
        scope: "CFG_OPTS_ENV_INFER",
      });
      deleteDotEnv();
      assertEquals(cfg.env("NUMBER"), 123);
    });

    Rhum.testCase("Options.safe prevents overwriting in Deno.env", () => {
      createDotEnv("x.env", "PATH=XYZ");
      assertThrows(() => {
        Cfg({
          env: {
            export: true,
            load: "x.env",
            safe: true,
          },
          load: {},
          scope: "CFG_OPTS_ENV_SAFE",
        });
      }, DuplicateEnv);
      deleteDotEnv("x.env");
    });
  });
});

Rhum.run();
