import {
  assert,
  assertEquals,
  assertThrows,
  existsSync,
  resolve,
  Rhum,
} from "./deps_test.ts";
import { Loader } from "./loader.ts";
import { Settings } from "./settings.interface.ts";
import { DuplicateEnv, InvalidPath } from "./error.ts";

export function writeFile(path: string, content: string): void {
  path = resolve(path);
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  Deno.writeFileSync(path, data, { create: true });
}

export function deleteFile(path: string): void {
  path = resolve(path);
  if (existsSync(path)) {
    Deno.removeSync(path);
  }
}

function genSettings(): Settings {
  return {
    env: {
      export: false,
      infer: false,
      load: [],
      safe: true,
    },
    load: [],
    scope: "",
  };
}

const FILENAME = ".env";
const ENV_KEY = "CFG_LOADER";
const dotEnv = `${ENV_KEY}=111`;
const obj = { bool: true };
const fn = () => ({ num: 9 });

Rhum.testPlan("loader.ts", () => {
  Rhum.testSuite("Sources", () => {
    Rhum.testCase("Can load an external file", () => {
      const settings: Settings = genSettings();
      settings.load = [FILENAME];

      writeFile(FILENAME, dotEnv);
      const loader = new Loader(settings);
      deleteFile(FILENAME);

      assert(loader.conf[ENV_KEY]);
    });

    Rhum.testCase("Can load a function", () => {
      const settings: Settings = genSettings();
      settings.load = [fn];

      const loader = new Loader(settings);

      assert(loader.conf["num"]);
    });

    Rhum.testCase("Can load a plain object", () => {
      const settings: Settings = genSettings();
      settings.load = [obj];

      const loader = new Loader(settings);

      assert(loader.conf["bool"]);
    });

    Rhum.testCase("Returns a merged configuration", () => {
      const settings: Settings = genSettings();
      settings.load = [FILENAME, fn, obj];

      writeFile(FILENAME, dotEnv);
      const loader = new Loader(settings);
      deleteFile(FILENAME);

      assert(loader.conf[ENV_KEY]);
      assert(loader.conf["num"]);
      assert(loader.conf["bool"]);
    });
  });

  Rhum.testSuite("Env", () => {
    Rhum.testCase("Can load an .env file", () => {
      const settings: Settings = genSettings();
      settings.env.load = [FILENAME];

      writeFile(FILENAME, dotEnv);
      const loader = new Loader(settings);
      deleteFile(FILENAME);

      assert(loader.env[ENV_KEY]);
    });

    Rhum.testCase("Doesn't export dotenv when env.export is 'false'", () => {
      const settings: Settings = genSettings();
      settings.env.load = [FILENAME];
      settings.env.export = false;

      writeFile(FILENAME, dotEnv);
      const loader = new Loader(settings);
      deleteFile(FILENAME);

      assert(!Deno.env.get(ENV_KEY));
    });

    Rhum.testCase("Exports dotenv when env.export is 'true'", () => {
      const settings: Settings = genSettings();
      settings.env.load = [FILENAME];
      settings.env.export = true;

      writeFile(FILENAME, dotEnv);
      const loader = new Loader(settings);
      deleteFile(FILENAME);

      assert(Deno.env.get(ENV_KEY));
    });

    Rhum.testCase("Doesn't infer values when env.infer is 'false'", () => {
      const settings: Settings = genSettings();
      settings.env.load = [FILENAME];
      settings.env.infer = false;

      writeFile(FILENAME, dotEnv);
      const loader = new Loader(settings);
      deleteFile(FILENAME);

      assertEquals(loader.env[ENV_KEY], "111");
    });

    Rhum.testCase("Infers values when env.infer is 'true'", () => {
      const settings: Settings = genSettings();
      settings.env.load = [FILENAME];
      settings.env.infer = true;

      writeFile(FILENAME, dotEnv);
      const loader = new Loader(settings);
      deleteFile(FILENAME);

      assertEquals(loader.env[ENV_KEY], 111);
    });

    Rhum.testCase(
      "Doesn't prevents overwriting when env.safe is 'false'",
      () => {
        const settings: Settings = genSettings();
        settings.env.load = [FILENAME];
        settings.env.export = true;
        settings.env.safe = false;

        Deno.env.set(ENV_KEY, "0");

        writeFile(FILENAME, dotEnv);
        let loader: Loader<any, any>;
        try {
          loader = new Loader(settings);
          assertEquals(Deno.env.get(ENV_KEY), "111");
        } catch (error) {
          deleteFile(FILENAME);
          assert(false);
        }
        deleteFile(FILENAME);
      },
    );

    Rhum.testCase(
      "Throws DuplicateEnv when overwriting if env.safe is 'true'",
      () => {
        const settings: Settings = genSettings();
        settings.env.load = [FILENAME];
        settings.env.export = true;
        settings.env.safe = true;

        Deno.env.set(ENV_KEY, "0");

        writeFile(FILENAME, dotEnv);

        assertThrows(() => {
          new Loader(settings);
        }, DuplicateEnv);

        deleteFile(FILENAME);
      },
    );
  });

  Rhum.testSuite("Loader.prototype.readFile()", () => {
    Rhum.testCase("Throws InvalidPath if the file doesn't exist", () => {
      assertThrows(() => {
        const settings: Settings = genSettings();
        settings.load = [FILENAME];
        new Loader(settings);
      }, InvalidPath);
    });
  });
});

Rhum.run();
