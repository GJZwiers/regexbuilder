import { assertArrayIncludes, assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { Pattern } from './Pattern.ts';
import { ExtendedRegExp } from "../extended-regexp/ExtendedRegExp.ts";

Deno.test("PatternBuilder - builds pattern from template and data correctly", () => {
    let pattern = Pattern.new().settings({ template: 'foo' }).data({foo: 'bar'}).build();
    assertArrayIncludes(pattern, [new ExtendedRegExp(/bar/, 'foo')]);
    assertEquals(pattern[0].test('bar'), true);
});

Deno.test("PatternBuilder - adds exception group correctly", () => {
    let pattern = Pattern.new()
    .settings({template: 'foo'})
    .data({foo: 'bar'})
    .filter(['baz'])
    .build()

    assertArrayIncludes(pattern, [new ExtendedRegExp(/baz|(bar)/, 'exclude|(foo)')]);
});

Deno.test("PatternBuilder - adds wildcard group correctly", () => {
    let pattern = Pattern.new()
    .settings({template: 'foo'})
    .data({foo: 'bar'})
    .wildcard('b.*')
    .build()

    assertArrayIncludes(pattern, [new ExtendedRegExp(/bar|(b.*)/, 'foo|(wildcard)')]);
});
