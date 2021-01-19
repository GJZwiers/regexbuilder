import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { ExtendedRegExp } from "./ExtendedRegExp.ts";

Deno.test("ExtendedRegExp - allows access to RegExp property", () => {
    let xregex = new ExtendedRegExp(/bar/, 'foo');
    assertEquals(xregex.global, false);
});
Deno.test("ExtendedRegExp - allows access to RegExp method", () => {
    let xregex = new ExtendedRegExp(/bar/, 'foo');
    assertEquals(xregex.test('bar'), true);
});
Deno.test("ExtendedRegExp - maps matches with no capturing groups", () => {
    let xregex = new ExtendedRegExp(/bar/, 'foo');
    let map = xregex.map(['bar']);
    assertEquals(map, {full_match: 'bar'});
});
Deno.test("ExtendedRegExp - maps matches with capturing groups", () => {
    let xregex = new ExtendedRegExp(/(bar)/, '(foo)');
    let map = xregex.map(['bar', 'bar']);
    assertEquals(map, {full_match: 'bar', foo: 'bar'});
});
Deno.test("ExtendedRegExp - maps matches with nested capturing groups (single tier)", () => {
    let xregex = new ExtendedRegExp(/(bar(foo))/, '(foo(bar))');
    let map = xregex.map(['barfoo', 'barfoo', 'foo']);
    assertEquals(map, {full_match: 'barfoo', foo: 'barfoo', bar: 'foo'});

    let xregex2 = new ExtendedRegExp(/((foo)bar)/, '((bar)foo)');
    let map2 = xregex2.map(['foobar', 'foobar', 'foo']);
    assertEquals(map2, {full_match: 'foobar', bar: 'foobar', foo: 'foo'});

    let xregex3 = new ExtendedRegExp(/((foo)bar)(baz)/, '((bar)foo)(baz)');
    let map3 = xregex3.map(['foobarbaz', 'foobar', 'foo', 'baz']);
    assertEquals(map3, {full_match: 'foobarbaz', bar: 'foobar', foo: 'foo', baz: 'baz'});
});

