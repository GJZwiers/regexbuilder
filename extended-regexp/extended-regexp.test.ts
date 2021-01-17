import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { ExtendedRegExp } from "./ExtendedRegExp.ts";

Deno.test("ExtendedRegExp - allows access to RegExp property", () => {
    let xregex = new ExtendedRegExp(/bar/, 'foo');
    assertEquals(xregex.global, false);
});
Deno.test("ExtendedRegExp - allows access to RegExp method", () => {
    let xregex = new ExtendedRegExp(/bar/, 'foo');
    let str = 'bar';
    assertEquals(xregex.test(str), true);
});
