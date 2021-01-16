import { assertArrayIncludes, assertEquals, assertThrows } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { ExtendedRegExp } from "../ExtendedRegExp.ts";
import { Regex } from '../regexbuilder/Regex.ts';
import { DefaultSpecification } from "../template-spec/TemplateSpecification.ts";
import { Pattern } from '../patternbuilder/Pattern.ts';

Deno.test("RegexBuilder - adds capturing group correctly with capturing()", () => {
    assertEquals(Regex.new().capture('foo').build(), /(foo)/);
});
Deno.test("RegexBuilder - adds any group other than named group correctly with group()", () => {
    assertEquals(Regex.new().group('cg', 'foo').build(), /(foo)/);
    assertEquals(Regex.new().group('ncg', 'foo').build(), /(?:foo)/);
    assertEquals(Regex.new().group('la', 'foo').build(), /(?=foo)/);
    assertEquals(Regex.new().group('lb', 'foo').build(), /(?<=foo)/);
    assertEquals(Regex.new().group('nla', 'foo').build(), /(?!foo)/);
    assertEquals(Regex.new().group('nlb', 'foo').build(), /(?<!foo)/);
});

Deno.test("RegexBuilder - adds named group correctly", () => {
    assertEquals(Regex.new().namedGroup('foo', 'bar').build(), /(?<foo>bar)/);
});

Deno.test("Regex.compile()", () => {
    assertEquals(Regex.new().part('foo').build(), new RegExp('foo'));
});

Deno.test("Regex", () => {
    assertThrows(
        () => {
        Regex.new().part('(foo').build();
    });
});

Deno.test("DefaultSpecification - builds template from data correctly", () => {
    let mockData = { foo: 'bar' };
    let mockSettings = { template: 'foo' };

    let spec = new DefaultSpecification(mockData, mockSettings);
    assertEquals(spec.buildTemplate(mockSettings.template), 'bar');
});

Deno.test("DefaultSpecification - joins arrays correctly", () => {
    let mockData = { foo: ['bar', 'baz'] };
    let mockSettings = { template: 'foo' };
    assertEquals(new DefaultSpecification(mockData, mockSettings)
        .buildTemplate(mockSettings.template), 'bar|baz');
});

Deno.test("ExtendedRegExp - allows access to RegExp property", () => {
    let xregex = new ExtendedRegExp(/bar/, 'foo');
    assertEquals(xregex.global, false);
});
Deno.test("ExtendedRegExp - allows access to RegExp method", () => {
    let xregex = new ExtendedRegExp(/bar/, 'foo');
    let str = 'bar';
    assertEquals(xregex.test(str), true);
});

Deno.test("PatternBuilder - ", () => {
    let regext = Pattern.new().settings({ template: 'foo' }).data({foo: 'bar'}).build();
    assertArrayIncludes(regext, [new ExtendedRegExp(/bar/, 'foo')]);
    assertEquals(regext[0].test('bar'), true);
});
