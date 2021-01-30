import { assertArrayIncludes, assertEquals, assertThrows } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { TemplateGroupHandler } from './TemplateGroupHandler.ts';

class MockHandler extends TemplateGroupHandler {
    _reset(value: string): this {
        this.str = value;
        this.openers = [];
        this.templateUnits = [];
        return this;
    }
}

Deno.test('TemplateGroupHandler - throws on receiving duplicates', () => {
    let handler = new MockHandler('(bar)(bar)');
    assertThrows(() => {
        return handler.handleBrackets();
    });
});

Deno.test('TemplateGroupHandler - handles a case with 0 capturing groups correctly', () => {
    let handler = new MockHandler('foo');
    assertEquals(handler.handleBrackets().length, 0);
});

Deno.test('TemplateGroupHandler - gets capturing groups from template correctly', () => {
    let handler = new MockHandler('(foo)');
    assertEquals(handler.handleBrackets().length, 1);
    assertEquals(handler._reset('(foo)(bar)').handleBrackets().length, 2);
    assertArrayIncludes(handler.handleBrackets(), ['foo','bar']);
});

Deno.test('TemplateGroupHandler - handles a combination of groups and other components correctly', () => {
    let handler = new MockHandler('foo[: ]+(bar)');
    assertEquals(handler.handleBrackets().length, 1);
    assertArrayIncludes(handler.handleBrackets(), ['bar']);
});

Deno.test('TemplateGroupHandler - handles non-capturing groups in template correctly', () => {
    let handler = new MockHandler('(?<=woo)(?<!waz)(?:foo)(bar)(?=baz)(?!bal)');
    assertEquals(handler.handleBrackets().length, 1);
    assertArrayIncludes(handler.handleBrackets(), ['bar']);
});

Deno.test('TemplateGroupHandler - places nested groups in the right order for mapping', () => {
    let handler = new MockHandler('(foo(bar))');
    let res = handler.handleBrackets();
    assertEquals(res, ['foo','bar']);

    res = handler._reset('((bar)foo)').handleBrackets();
    assertEquals(res, ['foo','bar']);

    res = handler._reset('((bar(baz))foo)').handleBrackets();
    assertEquals(res, ['foo','bar','baz']);

    res = handler._reset('(foo(bar))(baz)').handleBrackets();
    assertEquals(res, ['foo','bar','baz']);

    res = handler._reset('((bar)foo)(baz)').handleBrackets();
    assertEquals(res, ['foo','bar','baz']);

    res = handler._reset('((bar)foo)(baz((woo)bal))').handleBrackets();
    assertEquals(res, ['foo','bar','baz','bal','woo']);
});
