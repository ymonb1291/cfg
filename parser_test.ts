import { Rhum } from "./deps_test.ts";
import { UndefinedFileFormat } from "./error.ts";
import {
  MarkupLanguages,
  parser
} from "./parser.ts";

const configurations: { [key: string]: string } = {
  ".env": `ext=.env\nnumber=1`,
  "config.env": `ext=.env`,
  "config.json": `{"ext": ".json"}`,
  "config.toml": `ext = ".toml"`,
  "config.yaml": `ext: ".yaml"`,
  "config.yml": `ext: ".yml"`,
  "config.unknown": ``,
};

Rhum.testPlan("parser.ts", () => {
  Rhum.testSuite("parser() format guessing", () => {
    Rhum.testCase("Works for .env", () => {
      const ext = ".env";
      const filename = ext;
      const res = parser(configurations[filename], filename);
      Rhum.asserts.assertEquals(res.ext, ext);
    });

    Rhum.testCase("Works for config.env", () => {
      const ext = ".env";
      const filename = "config" + ext;
      const res = parser(configurations[filename], filename);
      Rhum.asserts.assertEquals(res.ext, ext);
    });

    Rhum.testCase("Works for .json", () => {
      const ext = ".json";
      const filename = "config" + ext;
      const res = parser(configurations[filename], filename);
      Rhum.asserts.assertEquals(res.ext, ext);
    });

    Rhum.testCase("Works for .toml", () => {
      const ext = ".toml";
      const filename = "config" + ext;
      const res = parser(configurations[filename], filename);
      Rhum.asserts.assertEquals(res.ext, ext);
    });

    Rhum.testCase("Works for .yaml", () => {
      const ext = ".yaml";
      const filename = "config" + ext;
      const res = parser(configurations[filename], filename);
      Rhum.asserts.assertEquals(res.ext, ext);
    });

    Rhum.testCase("Works for .yml", () => {
      const ext = ".yml";
      const filename = "config" + ext;
      const res = parser(configurations[filename], filename);
      Rhum.asserts.assertEquals(res.ext, ext);
    });

    Rhum.testCase(
      "Throws UndefinedFileFormat in case of undefined format",
      () => {
        const ext = ".unknown";
        const filename = "config" + ext;
        Rhum.asserts.assertThrows(() => {
          parser(configurations[filename], filename);
        }, UndefinedFileFormat);
      },
    );
  });

  Rhum.testSuite("parser(data, path, format)", () => {
    Rhum.testCase("Accepts the format parameter", () => {
      const ext = ".json";
      const filename = "config" + ext;
      const res = parser(
        configurations[filename],
        filename,
        MarkupLanguages.JSON,
      );
      Rhum.asserts.assertEquals(res.ext, ext);
    });
  });

  Rhum.testSuite("parser(data, path, infer)", () => {
    Rhum.testCase("Accepts the infer parameter", () => {
      const ext = ".env";
      const filename = ext;
      const res = parser(configurations[filename], filename, true);
      Rhum.asserts.assertEquals(res.ext, ext);
    });
  });

  Rhum.testSuite("parser(data, path, format, infer)", () => {
    Rhum.testCase(".env type inference can be enabled", () => {
      const ext = ".env";
      const filename = ext;
      const res = parser(
        configurations[filename],
        filename,
        MarkupLanguages.ENV,
        true,
      );
      Rhum.asserts.assertEquals(res.number, 1);
    });

    Rhum.testCase(".env type inference can be disabled", () => {
      const ext = ".env";
      const filename = ext;
      const res = parser(
        configurations[filename],
        filename,
        MarkupLanguages.ENV,
        false,
      );
      Rhum.asserts.assertEquals(res.number, "1");
    });
  });
});

Rhum.run();
