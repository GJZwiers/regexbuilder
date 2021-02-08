import { assertEquals, assertThrows } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { Regex } from './regex.ts';

Deno.test("RegexBuilder - compiles a build to a regex correctly", () => {
    const re = Regex.new().add('foo').regex.compile();
    assertEquals(re instanceof RegExp, true);
});
Deno.test("RegexBuilder - throws when building an invalid regex", () => {
    assertThrows(() => {
        Regex.new().add('(foo').build();
    });
});
Deno.test("RegexBuilder - adds groups correctly", () => {
    assertEquals(Regex.new().capture('foo').build(), /(foo)/);
    assertEquals(Regex.new().noncapture('foo').build(), /(?:foo)/);

    assertEquals(Regex.new().lookahead('foo').build(), /(?=foo)/);
    assertEquals(Regex.new().lookbehind('foo').build(), /(?<=foo)/);
    assertEquals(Regex.new().negatedLA('foo').build(), /(?!foo)/);
    assertEquals(Regex.new().negatedLB('foo').build(), /(?<!foo)/);

    assertEquals(Regex.new().followedBy('foo').build(), Regex.new().lookahead('foo').build());
    assertEquals(Regex.new().notFollowedBy('foo').build(), Regex.new().negatedLA('foo').build());
    assertEquals(Regex.new().precededBy('foo').build(), Regex.new().lookbehind('foo').build());
    assertEquals(Regex.new().notPrecededBy('foo').build(), Regex.new().negatedLB('foo').build());
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
    assertEquals(Regex.new().namedCapture('foo', 'bar').build(), /(?<foo>bar)/);
});
Deno.test("RegexBuilder - adds character class correctly", () => {
    assertEquals(Regex.new().digit().build(), /\d/);
    assertEquals(Regex.new().nonDigit().build(), /\D/);
    assertEquals(Regex.new().word().build(), /\w/);
    assertEquals(Regex.new().nonWord().build(), /\W/);
    assertEquals(Regex.new().whitespace().build(), /\s/);
    assertEquals(Regex.new().nonWhitespace().build(), /\S/);
    assertEquals(Regex.new().any().build(), /./);
    assertEquals(Regex.new().tab().build(), /\t/);
    assertEquals(Regex.new().carriageReturn().build(), /\r/);
    assertEquals(Regex.new().linefeed().build(), /\n/);
    assertEquals(Regex.new().formfeed().build(), /\f/);
    assertEquals(Regex.new().backspace().build(), /[\b]/);
    assertEquals(Regex.new().nul().build(), /\0/);
    assertEquals(Regex.new().boundary().build(), /\b/);
    assertEquals(Regex.new().negatedBoundary().build(), /\B/);
    assertEquals(Regex.new().bordered('foo').build(), /\bfoo\b/);
    assertEquals(Regex.new().lineStart().build(), /^/);
    assertEquals(Regex.new().lineEnd().build(), /$/);
    assertEquals(Regex.new().startsWith('foo').build(), /^foo/);
    assertEquals(Regex.new().endsWith('foo').build(), /foo$/);
});
Deno.test("RegexBuilder - adds control character correctly", () => {
    assertEquals(Regex.new().ctrlChar('A').build(), /\cA/);
    assertThrows(() => {
        return Regex.new().ctrlChar('0');
    })
});
Deno.test("RegexBuilder - adds hexadecimal character correctly", () => {
    assertEquals(Regex.new().hex('AA').build(), /\xAA/);
    assertThrows(() => {
        return Regex.new().hex('ZZ');
    })
});
Deno.test("RegexBuilder - adds UF16 code point correctly", () => {
    assertEquals(Regex.new().utf16('AAAA').build(), /\uAAAA/);
    assertThrows(() => {
        return Regex.new().utf16('ZZZZ');
    })
});
Deno.test("RegexBuilder - adds unicode correctly assuming 'u' flag is set", () => {
    assertEquals(Regex.new().unicode('AAAA').build(), /\u{AAAA}/);
    assertEquals(Regex.new().unicode('AAAAA').build(), /\u{AAAAA}/);
    assertThrows(() => {
        return Regex.new().utf16('ZZZZ');
    })
});
Deno.test("RegexBuilder - throws error on receiving invalid unicode", () => {
    assertThrows(() => {
        return Regex.new().unicode('000X');
    });
});
Deno.test("Regexbuilder - adds a character class with a quantifier correctly", () => {
    assertEquals(Regex.new().digits().build(), /\d{1}/);
    assertEquals(Regex.new().digits(2).build(), /\d{2}/);
    assertEquals(Regex.new().digits(2.).build(), /\d{2}/);
    assertEquals(Regex.new().digits(2,3).build(), /\d{2,3}/);
    assertEquals(Regex.new().digits(2,'*').build(), /\d{2,}/);

    assertEquals(Regex.new().nonDigits().build(), /\D{1}/);
    assertEquals(Regex.new().words().build(), /\w{1}/);
    assertEquals(Regex.new().nonWords().build(), /\W{1}/);
    assertEquals(Regex.new().whitespaces().build(), /\s{1}/);
    assertEquals(Regex.new().nonWhitespaces().build(), /\S{1}/);
})
Deno.test("RegexBuilder - adds flags correctly", () => {
    const re = Regex.new().add('foo').flags('gi').build();
    assertEquals(re.flags, 'gi');
});
Deno.test("RegexBuilder - handles user-specified separator for arrays", () => {
    assertEquals(Regex.new().joinWith(['foo','bar','baz'], '.').build(), /foo.bar.baz/);
});
Deno.test("RegexBuilder - handles regex literals in arrays and user-specified separator", () => {
    assertEquals(Regex.new().joinWith(['foo','bar','baz'], '.').build(), /foo.bar.baz/);
});
Deno.test("RegexBuilder - nests tiers correctly", () => {
    assertEquals(Regex.new().nest().add('foo').nest().add('bar').unnest().unnest().build(), /(foo(bar))/);
    assertEquals(Regex.new().nest().add('foo').nestNonCapture().add('bar').unnest().unnest().build(), /(foo(?:bar))/);
    assertEquals(Regex.new().nest().add('foo').nestLookahead().add('bar').unnest().unnest().build(), /(foo(?=bar))/);
    assertEquals(Regex.new().nest().nestLookbehind().add('bar').unnest().add('foo').unnest().build(), /((?<=bar)foo)/);
    assertEquals(Regex.new().nest().add('foo').nestNegatedLA().add('bar').unnest().unnest().build(), /(foo(?!bar))/);
    assertEquals(Regex.new().nest().nestNegatedLB().add('bar').unnest().add('foo').unnest().build(), /((?<!bar)foo)/);
});
Deno.test("RegexBuilder - unnests tiers correctly", () => {
    assertEquals(Regex.new().nest().add('foo').unnest().build(), /(foo)/);
    assertEquals(Regex.new().nest().add('foo').unnest(0).build(), /(foo)/);
    assertEquals(Regex.new().nest().add('foo').nest().add('bar').unnest(2).build(), /(foo(bar))/);
    assertEquals(Regex.new().nest().add('foo').nest().add('bar').unnest('*').build(), /(foo(bar))/);
});
Deno.test("RegexBuilder - nests with combi methods correctly", () => {
    assertEquals(Regex.new().nestAdd('foo').unnest().build(), /(foo)/);
    assertEquals(Regex.new().nestNamed('bar', 'foo').unnest().build(), /(?<bar>foo)/);
});
Deno.test("RegexBuilder - adds quantifiers correctly", () => {
    assertEquals(Regex.new().add('foo').times(2).build(), /foo{2}/);
    assertEquals(Regex.new().add('foo').between(2,3).build(), /foo{2,3}/);
    assertEquals(Regex.new().add('foo').atleast(2).build(), /foo{2,}/);
    assertEquals(Regex.new().add('foo').zeroPlus().build(), /foo*/);
    assertEquals(Regex.new().add('foo').onePlus().build(), /foo+/);
    assertEquals(Regex.new().add('foo').oneZero().build(), /foo?/);
});
Deno.test("RegexBuilder - applies lazy modifier to a quantifier correctly", () => {
    assertEquals(Regex.new().add('foo').zeroPlus().lazy().build(), /foo*?/);
});

Deno.test("RegexBuilder - adds back reference correctly", () => {
    assertEquals(Regex.new().capture('foo').ref(1).build(), /(foo)\1/);
    assertEquals(Regex.new().namedCapture('bar','foo').ref('bar').build(), /(?<bar>foo)\k<bar>/);
});

Deno.test("RegexBuilder - adds regex alternation correctly", () => {
    assertEquals(Regex.new().alts(['foo','bar']).build(), /foo|bar/);
    assertEquals(Regex.new().alts(['foo',/bar/]).build(), /foo|bar/);
    assertEquals(Regex.new().altGroup(['foo','bar'], 'ncg').build(), /(?:foo|bar)/);
    assertEquals(Regex.new().joinGroup(['foo','bar'], '.', 'ncg',).build(), /(?:foo.bar)/);
});

Deno.test("RegexBuilder - adds class correctly", () => {
    assertEquals(Regex.new().class('abc').build(), /[abc]/);
    assertEquals(Regex.new().negatedClass('abc').build(), /[^abc]/);
});

Deno.test("RegexBuilder - throws when trying to build while unnested tiers remain", () => {
    assertThrows(() => {
        return Regex.new().nest().add('foo').build() ;
    });
});
