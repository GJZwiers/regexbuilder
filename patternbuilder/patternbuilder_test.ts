import { assertArrayIncludes, assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { Pattern, PatternBuilderBase } from './pattern.ts';
import { ExtendedRegExp } from "../extended-regexp/extended_regexp.ts";

class MockBuilder extends PatternBuilderBase {}

Deno.test("PatternBuilder - initializes correctly", () => {
    const pattern = new MockBuilder();
    assertEquals(pattern instanceof MockBuilder, true);
});

Deno.test("PatternBuilder - builds pattern from template string and variables correctly", () => {
    const pattern = Pattern.new()
        .settings({template: 'foo'})
        .vars({foo: 'bar'})
        .build();

    assertEquals(pattern, new ExtendedRegExp(/bar/, 'foo'));
});

Deno.test("PatternBuilder - builds pattern from template string and variables correctly using deprecated method", () => {
    const pattern = Pattern.new()
        .settings({template: 'foo'})
        .data({foo: 'bar'})
        .build();

    assertEquals(pattern, new ExtendedRegExp(/bar/, 'foo'));
});

Deno.test("PatternBuilder - handles placeholders correctly", () => {
    const pattern = Pattern.new()
        .settings({template: 'foo'})
        .vars({foo: '{{bar}}'})
        .placeholders({bar: 'baz'})
        .build();

    assertEquals(pattern, new ExtendedRegExp(/baz/, 'foo'));
});

Deno.test("PatternBuilder - builds pattern from template and vars correctly using the template() shorthand", () => {
    const pattern = Pattern.new()
        .template('foo')
        .vars({foo: 'bar'})
        .build();

    assertEquals(pattern, new ExtendedRegExp(/bar/, 'foo'));
});

Deno.test("PatternBuilder - adds exception group correctly", () => {
    const pattern = Pattern.new()
        .settings({template: 'foo'})
        .vars({foo: 'bar'})
        .filter('baz')
        .build();
    assertEquals(pattern, new ExtendedRegExp(/baz|(bar)/, 'filter|(foo)'));

    const pattern2 = Pattern.new()
        .settings({template: 'foo'})
        .vars({foo: 'bar'})
        .except('baz')
        .build();
    assertEquals(pattern2, new ExtendedRegExp(/baz|(bar)/, 'filter|(foo)'));
});

Deno.test("PatternBuilder - adds wildcard group correctly", () => {
    const pattern = Pattern.new()
        .settings({template: 'foo'})
        .vars({foo: 'bar'})
        .wildcard('b.*')
        .build();

    assertEquals(pattern, new ExtendedRegExp(/bar|(b.*)/, 'foo|(wildcard)'));
});

Deno.test("PatternBuilder - returns multiple extended regexes on receiving multiple templates correctly", () => {
    const pattern = Pattern.new()
        .settings({template: ['foo', 'baz']})
        .vars({foo: 'bar'})
        .buildAll();

    assertArrayIncludes(pattern, [new ExtendedRegExp(/bar/, 'foo'), new ExtendedRegExp(/baz/, 'baz')]);
});

// Deno.test("PatternBuilder - adds wildcard group correctly", () => {
//     const pattern = Pattern.new()
//         .settings({template: '(foo)', map: true})
//         .vars({foo: 'bar'})
//         .build();

//     assertEquals(pattern, new ExtendedRegExp(/(bar)/, '(foo)'));
//     assertEquals(pattern.match('bar'), {full_match: 'bar', foo: 'bar'});
// });
