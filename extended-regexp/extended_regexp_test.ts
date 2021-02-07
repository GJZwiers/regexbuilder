import { assertEquals, assertObjectMatch, assertThrows } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { ExtendedRegExp, RegExpMatchMap } from "./extended_regexp.ts";

Deno.test("ExtendedRegExp - provides throughput to RegExp properties", () => {
    const xregex = new ExtendedRegExp(/bar/, 'foo', false);
    assertEquals(xregex.global, false);
    assertEquals(xregex.dotAll, false);
    assertEquals(xregex.global, false);
    assertEquals(xregex.ignoreCase, false);
    assertEquals(xregex.multiline, false);
    assertEquals(xregex.sticky, false);
    assertEquals(xregex.unicode, false);

    assertEquals(xregex.flags, '');

    assertEquals(xregex.lastIndex, 0);
    xregex.lastIndex = 1;
    assertEquals(xregex.lastIndex, 1);

    assertEquals(xregex.source, /bar/.source);

});
Deno.test("ExtendedRegExp - provides throughput to RegExp methods", () => {
    const xregex = new ExtendedRegExp(/bar/, 'foo', false);
    assertEquals(xregex.test('bar'), true);
    assertEquals(xregex.exec('bar'), /bar/.exec('bar'));
    assertEquals(xregex.match('bar'), 'bar'.match(/bar/));
    assertEquals(xregex.replace('bar', 'baz'), 'bar'.replace('bar', 'baz'));
    assertEquals(xregex.search('bar'), 'bar'.search('bar'));
    assertEquals(xregex.split('bar'), 'bar'.split('bar'));

    const xregexGlobal = new ExtendedRegExp(/bar/g, 'foo', false);
    assertEquals(xregexGlobal.matchAll('bar'), 'bar'.matchAll(/bar/g));
});
// Deno.test("ExtendedRegExp - automaps correctly", () => {
//     const xregex = new ExtendedRegExp(/bar/, 'foo', true);
//     assertEquals(xregex.match('bar'), {full_match: 'bar'});
//     const xregex2 = new ExtendedRegExp(/bar/, 'foo', true);
// });
Deno.test("ExtendedRegExp - gets template correctly", () => {
    const xregex = new ExtendedRegExp(/bar/, 'foo', true);
    assertEquals(xregex.getTemplate(), 'foo');
});
Deno.test("ExtendedRegExp - maps matches with no capturing groups", () => {
    const xregex = new ExtendedRegExp(/bar/, 'foo', false);
    const map = xregex.map(['bar']);
    assertEquals(map, {full_match: 'bar'});
});
Deno.test("ExtendedRegExp - maps matches with capturing groups", () => {
    const xregex = new ExtendedRegExp(/(bar)/, '(foo)', false);
    const map = xregex.map(['bar', 'bar']);
    assertObjectMatch(map, {foo: 'bar'});
});
Deno.test("ExtendedRegExp - maps matches with nested capturing groups", () => {
    const xregex = new ExtendedRegExp(/((foo)bar)/, '((bar)foo)', false);
    const map = xregex.map(['foobar', 'foobar', 'foo']);
    assertObjectMatch(map, {bar: 'foo', foo: 'foobar'});
});
// Deno.test("ExtendedRegExp - maps matches with capturing groups", () => {
//     const xregex = new ExtendedRegExp(/(bar)/, '(foo)', false);
//     const map = xregex.matchMap('bar');
//     assertObjectMatch(<RegExpMatchMap>map, {full_match: 'bar', foo: 'bar'});
// });
Deno.test("ExtendedRegExp - throws error on mapping template with unnamed capturing group (added with filter method)", () => {
    const xregex = new ExtendedRegExp(/filter|((bar))/, 'filter|((foo))', false);
    assertThrows(() => {
        return xregex.matchMap('bar');
    });
});
