import { join, isAbsolute, existsSync } from "./depts.ts";
import { ErrorHandler } from "./error.ts";

export class FileSystem {
  public readFile(pathToFile: string): string {
    return this.loadFile(this.toAbsolutePath(pathToFile));
  }

  private toAbsolutePath(pathToFile: string): string {
    switch (isAbsolute(pathToFile)) {
      case true:
        return pathToFile;
      case false:
        return join(Deno.cwd(), pathToFile);
    }
  }

  private decode(pathToFile: string, data: Uint8Array): string {
    const decoder = new TextDecoder("utf-8");
    try {
      return decoder.decode(data);
    } catch (error) {
      throw new ErrorHandler("FILE_DECODING_FAILURE", `Could not decode ${pathToFile}`);
    }
  }

  private loadFile(pathToFile: string): string {
    if (existsSync(pathToFile)) {
      return this.decode(pathToFile, Deno.readFileSync(pathToFile));
    } else {
      throw new ErrorHandler("FILE_READ_FAILURE", `Can't read ${pathToFile}`);
    }
  }
}
