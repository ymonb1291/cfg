import { Rhum } from "./deps_test.ts";
import { Loader } from "./loader.ts";
import { Settings } from "./settings.interface.ts";
import {
  DuplicateEnv,
  InvalidPath,
} from "./error.ts";
import {
  deleteFile,
  writeFile,
} from "./test.utils.ts";

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

const VAL_NUM=9;
const VAL_BOOL=true;
const FILENAME = ".env";
const ENV_KEY = "CFG_LOADER";
const dotEnv = `${ENV_KEY}=${VAL_NUM}`;
const obj = { bool: VAL_BOOL };
const fn = () => ({ num: VAL_NUM });

Rhum.testPlan("loader.ts", () => {
  
  Rhum.testSuite("Sources", () => {
    Rhum.testCase("Can load an external file", () => {
      const settings: Settings = genSettings();
      settings.load = [FILENAME];

      writeFile(FILENAME, dotEnv);
      const loader = new Loader(settings);
      deleteFile(FILENAME);

      Rhum.asserts.assert(loader.conf[ENV_KEY]);
    });

    Rhum.testCase("Can load a function", () => {
      const settings: Settings = genSettings();
      settings.load = [fn];

      const loader = new Loader(settings);

      Rhum.asserts.assertEquals(loader.conf["num"], VAL_NUM);
    });

    Rhum.testCase("Can load a plain object", () => {
      const settings: Settings = genSettings();
      settings.load = [obj];

      const loader = new Loader(settings);

      Rhum.asserts.assertEquals(loader.conf["bool"], VAL_BOOL);
    });

    Rhum.testCase("Returns a merged configuration", () => {
      const settings: Settings = genSettings();
      settings.load = [FILENAME, fn, obj];

      writeFile(FILENAME, dotEnv);
      const loader = new Loader(settings);
      deleteFile(FILENAME);

      Rhum.asserts.assertEquals(loader.conf[ENV_KEY], String(VAL_NUM));
      Rhum.asserts.assertEquals(loader.conf["num"], VAL_NUM);
      Rhum.asserts.assertEquals(loader.conf["bool"], VAL_BOOL);
    });
  });

  Rhum.testSuite("Env", () => {
    Rhum.testCase("Can load an .env file", () => {
      const settings: Settings = genSettings();
      settings.env.load = [FILENAME];

      writeFile(FILENAME, dotEnv);
      const loader = new Loader(settings);
      deleteFile(FILENAME);

      Rhum.asserts.assertEquals(loader.env[ENV_KEY], String(VAL_NUM));
    });

    Rhum.testCase("Doesn't export dotenv when env.export is 'false'", () => {
      const settings: Settings = genSettings();
      settings.env.load = [FILENAME];
      settings.env.export = false;

      writeFile(FILENAME, dotEnv);
      new Loader(settings);
      deleteFile(FILENAME);

      Rhum.asserts.assert(!Deno.env.get(ENV_KEY));
    });

    Rhum.testCase("Exports dotenv when env.export is 'true'", () => {
      const settings: Settings = genSettings();
      settings.env.load = [FILENAME];
      settings.env.export = true;

      writeFile(FILENAME, dotEnv);
      new Loader(settings);
      deleteFile(FILENAME);

      Rhum.asserts.assert(Deno.env.get(ENV_KEY));
    });

    Rhum.testCase("Doesn't infer values when env.infer is 'false'", () => {
      const settings: Settings = genSettings();
      settings.env.load = [FILENAME];
      settings.env.infer = false;

      writeFile(FILENAME, dotEnv);
      const loader = new Loader(settings);
      deleteFile(FILENAME);

      Rhum.asserts.assertEquals(loader.env[ENV_KEY], String(VAL_NUM));
    });

    Rhum.testCase("Infers values when env.infer is 'true'", () => {
      const settings: Settings = genSettings();
      settings.env.load = [FILENAME];
      settings.env.infer = true;

      writeFile(FILENAME, dotEnv);
      const loader = new Loader(settings);
      deleteFile(FILENAME);

      Rhum.asserts.assertEquals(loader.env[ENV_KEY], VAL_NUM);
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
        try {
          new Loader(settings);
          Rhum.asserts.assertEquals(Deno.env.get(ENV_KEY), String(VAL_NUM));
        } catch {
          deleteFile(FILENAME);
          Rhum.asserts.assert(false);
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

        Rhum.asserts.assertThrows(() => {
          new Loader(settings);
        }, DuplicateEnv);

        deleteFile(FILENAME);
      },
    );
  });

  Rhum.testSuite("Loader.prototype.readFile()", () => {
    Rhum.testCase("Throws InvalidPath if the file doesn't exist", () => {
      Rhum.asserts.assertThrows(() => {
        const settings: Settings = genSettings();
        settings.load = [FILENAME];
        new Loader(settings);
      }, InvalidPath);
    });
  });

});

Rhum.run();
