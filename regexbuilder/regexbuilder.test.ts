import { assertEquals, assertThrows } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { Regex } from './Regex.ts';

Deno.test("RegexBuilder - adds capturing group correctly with capturing()", () => {
    assertEquals(Regex.new().capture('foo').build(), /(foo)/);
});

Deno.test("RegexBuilder - supports regex literal input", () => {
    assertEquals(Regex.new().capture(/foo/).build(), /(foo)/);
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

Deno.test("RegexBuilder - compiles a build to a pattern correctly", () => {
    assertEquals(Regex.new().add('foo').build(), /foo/);
});

Deno.test("RegexBuilder - throws when building an invalid pattern", () => {
    assertThrows(() => {
        Regex.new().add('(foo').build();
    });
});

Deno.test("RegexBuilder - adds flags correctly", () => {
    assertEquals(Regex.new().add('foo').flags('gi').build(), /foo/gi);
});
