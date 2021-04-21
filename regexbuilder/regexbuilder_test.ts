import { assertArrayIncludes, assertEquals, assertStringIncludes, assertThrows } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { groupCode } from "./process_group_code.ts";
import { Regex } from './regex.ts';
import { RegexBuilderBase } from "./regex_builder_base.ts";

class MockBuilder extends RegexBuilderBase {}

Deno.test("RegexBuilder - compiles a build to a regex correctly", () => {
    const re = Regex.new().add('foo').regex.compile();
    assertEquals(re instanceof RegExp, true);
});
Deno.test("RegexBuilder - throws when building an invalid regex", () => {
    assertThrows(() => {
        Regex.new().add('(foo').build();
    });
});
Deno.test("RegexBuilder - initializes correctly", () => {
    const re = Regex.new();
    assertEquals(re.regex instanceof Regex, true);
    assertEquals(re.nests , 0);

    const base = new MockBuilder();
    assertEquals(base.regex instanceof Regex, true);
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
    assertEquals(Regex.new().group('foo', 'cg').build(), /(foo)/);
    assertEquals(Regex.new().group('foo', 'ncg').build(), /(?:foo)/);
    assertEquals(Regex.new().group('foo', 'la').build(), /(?=foo)/);
    assertEquals(Regex.new().group('foo', 'lb').build(), /(?<=foo)/);
    assertEquals(Regex.new().group('foo', 'nla').build(), /(?!foo)/);
    assertEquals(Regex.new().group('foo', 'nlb').build(), /(?<!foo)/);

    assertThrows(() => {
        Regex.new().group('foo', <groupCode>'foo').build()
    });
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

    assertEquals(Regex.new().cr().build(), Regex.new().carriageReturn().build());
    assertEquals(Regex.new().lf().build(), Regex.new().linefeed().build());

    assertEquals(Regex.new().nul().add('0').build(), /\00/);
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
    assertEquals(Regex.new().unicodeChar('AAAA').build(), /\u{AAAA}/);
    assertEquals(Regex.new().unicodeChar('AAAAA').build(), /\u{AAAAA}/);
    assertThrows(() => {
        return Regex.new().utf16('ZZZZ');
    })
});
Deno.test("RegexBuilder - throws error on receiving invalid unicode", () => {
    assertThrows(() => {
        return Regex.new().unicodeChar('000X');
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
    assertStringIncludes(Regex.new().global().regex.flags, 'g');
    assertStringIncludes(Regex.new().caseInsensitive().regex.flags, 'i');

    assertArrayIncludes(Regex.new().global().caseInsensitive().regex.flags.split(''), ['g','i']);
    assertArrayIncludes(Regex.new().flags('gi').regex.flags.split(''), ['g','i']);

    assertStringIncludes(Regex.new().multiline().regex.flags, 'm');
    assertStringIncludes(Regex.new().unicode().regex.flags, 'u');
    assertStringIncludes(Regex.new().sticky().regex.flags, 'y');
    assertStringIncludes(Regex.new().dotAll().regex.flags, 's');

    assertStringIncludes(Regex.new().indices().regex.flags, 'd');

    assertArrayIncludes(Regex.new().dotAll().global().multiline().regex.flags.split(''), ['s','g','m']);
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

    assertEquals(Regex.new().add('foo').times(2).oneZero().build(), /foo{2}?/);
});
Deno.test("RegexBuilder - applies lazy modifier to a quantifier correctly", () => {
    assertEquals(Regex.new().add('foo').zeroPlus().lazy().build(), /foo*?/);
    assertEquals(Regex.new().add('foo').lazy().build(), /foo?/);
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
    assertEquals(Regex.new().joinGroup(['foo','bar'], '.').build(), /foo.bar/);
});

Deno.test("RegexBuilder - adds range correctly", () => {
    assertEquals(Regex.new().range('abc').build(), /[abc]/);
    assertEquals(Regex.new().negatedRange('abc').build(), /[^abc]/);

    assertEquals(Regex.new().class('abc').build(), /[abc]/);
    assertEquals(Regex.new().negatedClass('abc').build(), /[^abc]/);
});

Deno.test("RegexBuilder - throws when trying to build while unnested tiers remain", () => {
    assertThrows(() => {
        return Regex.new().nest().add('foo').build();
    });
});
