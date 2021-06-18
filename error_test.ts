import { DEFAULT_SCOPE } from "./cfg.ts";
import { Rhum } from "./deps_test.ts";
import * as Errors from "./error.ts";

const META = "META";
const SYMBOL = Symbol("META");

Rhum.testPlan("error.ts", () => {

  Rhum.testSuite("DuplicateEnv", () => {

    Rhum.testCase("Error name", () => {
      try {
        throw new Errors.DuplicateEnv(META);
      } catch (error) {
        Rhum.asserts.assertEquals(error.name, "DuplicateEnv");
      }
    });

    Rhum.testCase("Error message", () => {
      Rhum.asserts.assertThrows(
        () => {
          throw new Errors.DuplicateEnv(META);
        },
        Errors.DuplicateEnv,
        `'${META}' already exist`,
      );
    });
  });

  Rhum.testSuite("InvalidPath", () => {

    Rhum.testCase("Error name", () => {
      try {
        throw new Errors.InvalidPath(META);
      } catch (error) {
        Rhum.asserts.assertEquals(error.name, "InvalidPath");
      }
    });

    Rhum.testCase("Error message", () => {
      Rhum.asserts.assertThrows(
        () => {
          throw new Errors.InvalidPath(META);
        },
        Errors.InvalidPath,
        `Can't find the file '${META}'`,
      );
    });
  });

  Rhum.testSuite("ScopeOverwriteError", () => {

    Rhum.testCase("Error name with a string as parameter", () => {
      try {
        throw new Errors.ScopeOverwriteError(META);
      } catch (error) {
        Rhum.asserts.assertEquals(error.name, "ScopeOverwriteError");
      }
    });

    Rhum.testCase("Error message with a string as parameter", () => {
      Rhum.asserts.assertThrows(
        () => {
          throw new Errors.ScopeOverwriteError(META);
        },
        Errors.ScopeOverwriteError,
        `Scope '${META}' already exist`,
      );
    });

    Rhum.testCase("Error name with a symbol as parameter", () => {
      try {
        throw new Errors.ScopeOverwriteError(SYMBOL);
      } catch (error) {
        Rhum.asserts.assertEquals(error.name, "ScopeOverwriteError");
      }
    });

    Rhum.testCase("Error message with a symbol as parameter", () => {
      Rhum.asserts.assertThrows(
        () => {
          throw new Errors.ScopeOverwriteError(SYMBOL);
        },
        Errors.ScopeOverwriteError,
        `Scope '${String(SYMBOL)}' already exist`,
      );
    });
  });

  Rhum.testSuite("UndefinedFileFormat", () => {
    
    Rhum.testCase("Error name", () => {
      try {
        throw new Errors.UndefinedFileFormat(META);
      } catch (error) {
        Rhum.asserts.assertEquals(error.name, "UndefinedFileFormat");
      }
    });

    Rhum.testCase("Error message", () => {
      Rhum.asserts.assertThrows(
        () => {
          throw new Errors.UndefinedFileFormat(META);
        },
        Errors.UndefinedFileFormat,
        `Can't determine the format of '${META}'`,
      );
    });
  });

  Rhum.testSuite("UnknownScopeError", () => {

    Rhum.testCase("Error name with a string as parameter", () => {
      try {
        throw new Errors.UnknownScopeError(META);
      } catch (error) {
        Rhum.asserts.assertEquals(error.name, "UnknownScopeError");
      }
    });

    Rhum.testCase("Error message with a string as parameter", () => {
      Rhum.asserts.assertThrows(
        () => {
          throw new Errors.UnknownScopeError(META);
        },
        Errors.UnknownScopeError,
        `Scope '${META}' has not yet been initialized`,
      );
    });

    Rhum.testCase("Error name with a symbol as parameter", () => {
      try {
        throw new Errors.UnknownScopeError(SYMBOL);
      } catch (error) {
        Rhum.asserts.assertEquals(error.name, "UnknownScopeError");
      }
    });

    Rhum.testCase("Error message with a symbol as parameter", () => {
      Rhum.asserts.assertThrows(
        () => {
          throw new Errors.UnknownScopeError(SYMBOL);
        },
        Errors.UnknownScopeError,
        `Scope '${String(SYMBOL)}' has not yet been initialized`,
      );
    });

    Rhum.testCase("Error name with the default scope", () => {
      try {
        throw new Errors.UnknownScopeError(DEFAULT_SCOPE);
      } catch (error) {
        Rhum.asserts.assertEquals(error.name, "UnknownScopeError");
      }
    });

    Rhum.testCase("Error message with the default scope", () => {
      Rhum.asserts.assertThrows(
        () => {
          throw new Errors.UnknownScopeError(DEFAULT_SCOPE);
        },
        Errors.UnknownScopeError,
        `Cfg has not been initialized yet`,
      );
    });

  });

});

Rhum.run();
