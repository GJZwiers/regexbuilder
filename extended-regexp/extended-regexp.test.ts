import { assertEquals, assertObjectMatch } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { ExtendedRegExp } from "./ExtendedRegExp.ts";

Deno.test("ExtendedRegExp - provides throughput to RegExp property", () => {
    let xregex = new ExtendedRegExp(/bar/, 'foo', false);
    assertEquals(xregex.global, false);
});
Deno.test("ExtendedRegExp - provides throughput to RegExp method", () => {
    let xregex = new ExtendedRegExp(/bar/, 'foo', false);
    assertEquals(xregex.test('bar'), true);
});
Deno.test("ExtendedRegExp - maps matches with no capturing groups", () => {
    let xregex = new ExtendedRegExp(/bar/, 'foo', false);
    let map = xregex.map(['bar']);
    assertEquals(map, {full_match: 'bar'});
});
Deno.test("ExtendedRegExp - maps matches with capturing groups", () => {
    let xregex = new ExtendedRegExp(/(bar)/, '(foo)', false);
    let map = xregex.map(['bar', 'bar']);
    assertObjectMatch(map, {foo: 'bar'});
});
Deno.test("ExtendedRegExp - maps matches with nested capturing groups", () => {
    let xregex2 = new ExtendedRegExp(/((foo)bar)/, '((bar)foo)', false);
    let map2 = xregex2.map(['foobar', 'foobar', 'foo']);
    assertObjectMatch(map2, {bar: 'foo', foo: 'foobar'});
});
