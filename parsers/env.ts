const REGEXP_NEWLINES: RegExp = /\n|\r|\r\n/;
const REGEXP_DATA: RegExp = /^\s*(?![0-9_]*\s*=\s*([\W\w\s.]*)\s*$)[A-Z0-9_]+\s*=\s*(.*)?\s*(?<!#.*)/gi;
const REGEXP_KEY: RegExp = /.+(?<!=.*)/g;
const REGEXP_VALUE: RegExp = /(?!.*=).+/g;

export class ENVParser {
  public parse(data: string): unknown {
    const obj: { [key: string]: unknown } = {};
    data
      .split(REGEXP_NEWLINES)
      .map((line) => {
        return this.parseLine(line);
      })
      .filter((val) => val)
      .forEach((tuple) => {
        if (Array.isArray(tuple) && typeof tuple[0] === "string") {
          obj[tuple[0]] = tuple[1];
        }
      });
    return obj;
  }

  private parseLine(line: string): [string | void, unknown] | void {
    const data = line.match(REGEXP_DATA);
    if (Array.isArray(data)) {
      const key = data[0].match(REGEXP_KEY);
      const value = data[0].match(REGEXP_VALUE);
      return [this.parseKey(key), this.parseValue(value)];
    } else {
      return void 0;
    }
  }

  private parseKey(key: RegExpMatchArray | null): string | void {
    if (!key) {
      return void 0;
    } else {
      return key[0].trim();
    }
  }

  private parseValue(val: RegExpMatchArray | null): unknown {
    if (!val) {
      return void 0;
    } else {
      const str: string = val[0].trim();
      const is_doubleQuoted: boolean = str[0] === `"` && str[str.length - 1] === `"` ? true : false;
      const is_simpleQuoted: boolean = str[0] === `'` && str[str.length - 1] === `'` ? true : false;

      if (is_doubleQuoted) {
        return str.substr(1, str.length - 2).replace(/\\"/g, `"`);
      } else if (is_simpleQuoted) {
        return str.substr(1, str.length - 2).replace(/\\'/g, `'`);
      } else if (!isNaN(parseInt(str))) {
        return parseInt(str);
      } else if (str.toLowerCase() === "true") {
        return true;
      } else if (str.toLowerCase() === "false") {
        return false;
      } else {
        return str;
      }
    }
  }
}
