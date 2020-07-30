// TODO update error messages

import { join, isAbsolute, existsSync } from "./depts.ts";

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
      throw new Error(`Error when decoding ${pathToFile}`);
    }
  }

  private loadFile(pathToFile: string): string {
    if (existsSync(pathToFile)) {
      return this.decode(pathToFile, Deno.readFileSync(pathToFile));
    } else {
      throw new Error(`Can't open file ${pathToFile}`);
    }
  }
}
