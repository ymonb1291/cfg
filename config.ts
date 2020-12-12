import { Loader } from "./loader.ts";

import type { Settings } from "./settings.interface.ts";

/** Describes the type of conf */
export interface Conf<T = string | number | boolean> {
  [key: string]: T | Conf | (T | Conf)[];
}

/** Describes the type of env */
export type Env<T = string | number | boolean> = KeyValuePairs<T>;

export interface KeyValuePairs<T = string | number | boolean> {
  [key: string]: T;
}

export class Config<C extends Conf, E extends Env> {
  #conf: C;
  #env: E;

  constructor(settings: Settings) {
    const { conf, env } = new Loader<C, E>(settings);
    this.#conf = conf;
    this.#env = env;
  }

  public env(): NonNullable<E>;
  public env<P1 extends keyof NonNullable<E>>(prop1: P1): NonNullable<E>[P1];
  public env(prop?: string): any {
    return prop ? this.#env[prop] : this.#env;
  }

  public get<P1 extends keyof NonNullable<C>>(): NonNullable<C>;
  public get<P1 extends keyof NonNullable<C>>(prop1: P1): NonNullable<C>[P1];
  public get<
    P1 extends keyof NonNullable<C>,
    P2 extends keyof NonNullable<NonNullable<C>[P1]>,
  >(
    prop1: P1,
    prop2: P2,
  ): NonNullable<NonNullable<C>[P1]>[P2];
  public get<
    P1 extends keyof NonNullable<C>,
    P2 extends keyof NonNullable<NonNullable<C>[P1]>,
    P3 extends keyof NonNullable<NonNullable<C>[P1]>[P2],
  >(
    prop1: P1,
    prop2: P2,
    prop3: P3,
  ): NonNullable<NonNullable<NonNullable<C>[P1]>[P2]>[P3];
  public get<
    P1 extends keyof NonNullable<C>,
    P2 extends keyof NonNullable<NonNullable<C>[P1]>,
    P3 extends keyof NonNullable<NonNullable<C>[P1]>[P2],
    P4 extends keyof NonNullable<NonNullable<NonNullable<C>[P1]>[P2]>[P3],
  >(
    prop1: P1,
    prop2: P2,
    prop3: P3,
    prop4: P4,
  ): NonNullable<NonNullable<NonNullable<NonNullable<C>[P1]>[P2]>[P3]>[P4];
  public get(...props: string[]): any {
    return props.reduce(
      (result, prop) => (result == null ? undefined : result[prop]),
      this.#conf as any,
    );
  }

  public getp(path?: string): unknown {
    const matches = (path || "").match(
      /([a-zA-Z0-9]+)|(?=[a-zA-Z0-9]+\[)([a-zA-Z0-9]+)|(?=\[[a-zA-Z0-9]+\])([a-zA-Z0-9]+)/g,
    ) || [];
    return matches.reduce(
      (result, prop) => (result == null ? undefined : result[prop]),
      this.#conf as any,
    );
  }
}
