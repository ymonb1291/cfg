import {
  existsSync,
  resolve,
} from "./deps_test.ts";

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
