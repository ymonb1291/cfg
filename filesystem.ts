import { join, isAbsolute } from "./depts.ts";
import { existsSync } from "./depts.ts";

export class FileSystem {
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

  public readFile(pathToFile: string): string {
    switch (isAbsolute(pathToFile)) {
      case true:
        return this.loadFile(pathToFile);
      case false:
        return this.loadFile(join(Deno.cwd(), pathToFile));
    }
  }
}
