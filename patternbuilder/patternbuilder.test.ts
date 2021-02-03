import { assertArrayIncludes, assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { Pattern } from './Pattern.ts';
import { ExtendedRegExp } from "../extended-regexp/ExtendedRegExp.ts";

Deno.test("PatternBuilder - builds pattern from template and data correctly", () => {
    let pattern = Pattern.new()
        .settings({template: 'foo'})
        .vars({foo: 'bar'})
        .build();

    assertEquals(pattern, new ExtendedRegExp(/bar/, 'foo', false));
    assertEquals(pattern.test('bar'), true);
});

Deno.test("PatternBuilder - adds exception group correctly", () => {
    let pattern = Pattern.new()
        .settings({template: 'foo'})
        .vars({foo: 'bar'})
        .filter(['baz'])
        .build();

        assertEquals(pattern, new ExtendedRegExp(/baz|(bar)/, 'filter|(foo)', false));
});

Deno.test("PatternBuilder - adds wildcard group correctly", () => {
    let pattern = Pattern.new()
        .settings({template: 'foo'})
        .vars({foo: 'bar'})
        .wildcard('b.*')
        .build();

        assertEquals(pattern, new ExtendedRegExp(/bar|(b.*)/, 'foo|(wildcard)', false));
});

Deno.test("PatternBuilder - returns multiple extended regexes on receiving multiple templates correctly", () => {
    let pattern = Pattern.new()
        .settings({template: ['foo', 'baz']})
        .vars({foo: 'bar'})
        .buildAll();

        assertArrayIncludes(pattern, [new ExtendedRegExp(/bar/, 'foo', false), new ExtendedRegExp(/baz/, 'baz', false)]);
});
