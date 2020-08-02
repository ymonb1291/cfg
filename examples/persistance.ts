// Command: $ deno run --unstable --allow-read ./persistance.ts
import cfg from "../mod.ts";
import { customers } from "./configs/customers.ts";
import { Customers } from "./types/customers.ts";
import { Library } from "./types/library.ts";

type Foo = {
  foo: string;
};

const foo: Foo = {
  foo: "bar",
};

function scopeA() {
  // Here, we create configurations
  cfg([foo]);
  cfg("CUSTOMERS", [customers]);
  cfg("LIBRARY", ["./configs/library.yml"]);
}

// Now let's work in another block. Could also be another module.
function scopeB() {
  const defaultScope = cfg<Foo>();
  const customers = cfg<Customers>("CUSTOMERS");
  const library = cfg<Library>("LIBRARY");

  console.log(defaultScope.getp("foo")); // -> outputs "bar"
  console.log(customers.getp("customers[0]")); // -> outputs { name: "Francesco Suarez", age: 54 }
  console.log(library.getp("books[1].title")); // -> outputs "To Kill A Mockingbird"
}

scopeA();
scopeB();
