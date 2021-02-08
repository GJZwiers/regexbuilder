import { assertArrayIncludes, assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { Pattern } from './pattern.ts';
import { ExtendedRegExp } from "../extended-regexp/extended_regexp.ts";

Deno.test("PatternBuilder - builds pattern from template and vars correctly", () => {
    let pattern = Pattern.new()
        .settings({template: 'foo'})
        .vars({foo: 'bar'})
        .build();

    assertEquals(pattern, new ExtendedRegExp(/bar/, 'foo', false));
});

Deno.test("PatternBuilder - still builds pattern from template and vars correctly using deprecated method", () => {
    let pattern = Pattern.new()
        .settings({template: 'foo'})
        .data({foo: 'bar'})
        .build();

    assertEquals(pattern, new ExtendedRegExp(/bar/, 'foo', false));
});

Deno.test("PatternBuilder - handles placeholders correctly", () => {
    let pattern = Pattern.new()
        .settings({template: 'foo'})
        .vars({foo: '{{bar}}'})
        .placeholders({bar: 'baz'})
        .build();

    assertEquals(pattern, new ExtendedRegExp(/baz/, 'foo', false));
});

Deno.test("PatternBuilder - builds pattern from template and vars correctly using the template() shorthand", () => {
    let pattern = Pattern.new()
        .template('foo')
        .vars({foo: 'bar'})
        .build();

    assertEquals(pattern, new ExtendedRegExp(/bar/, 'foo', false));
});

Deno.test("PatternBuilder - adds exception group correctly", () => {
    let pattern = Pattern.new()
        .settings({template: 'foo'})
        .vars({foo: 'bar'})
        .filter('baz')
        .build();
    assertEquals(pattern, new ExtendedRegExp(/baz|(bar)/, 'filter|(foo)', false));

    let pattern2 = Pattern.new()
        .settings({template: 'foo'})
        .vars({foo: 'bar'})
        .except('baz')
        .build();
    assertEquals(pattern2, new ExtendedRegExp(/baz|(bar)/, 'filter|(foo)', false));
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
