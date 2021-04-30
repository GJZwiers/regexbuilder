import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { DefaultSpecification, SimpleSpecification, SpecificationData } from "../template-spec/template_specification.ts";

Deno.test("DefaultSpecification - builds template from data correctly", () => {
    const mock: SpecificationData = {
        settings: { template: 'foo' },
        vars: { foo: 'bar' }, 
        placeholders: {}
    };
    const spec = new DefaultSpecification(mock);
    assertEquals(spec.compose(<string>mock.settings.template), 'bar');
});

Deno.test("DefaultSpecification - builds template from data correctly", () => {
    const mock: SpecificationData = { 
        settings: { template: '\\#foo#moo', symbol: '#' },
        vars: { moo: 'bar'}, 
        placeholders: {}
    };
    const spec = new DefaultSpecification(mock);
    assertEquals(spec.compose(<string>mock.settings.template), '#foobar');

    const mock2: SpecificationData = { 
        settings: { template: 'foo', symbol: '#' },
        vars: { foo: 'bar'}
    };
    const spec2 = new SimpleSpecification(mock2);
    assertEquals(spec2.compose(<string>mock2.settings.template), 'bar');
});

Deno.test("DefaultSpecification - joins arrays correctly", () => {
    const mock = {
        vars: { foo: ['bar','baz'] },
        settings: { template: 'foo' },
        placeholders: {}
    };

    assertEquals(new DefaultSpecification(mock)
        .compose(<string>mock.settings.template), 'bar|baz');
});

Deno.test("DefaultSpecification - substitutes placeholders correctly", () => {
    const mock = { 
        vars: {foo: ['{{bar}}', 'baz'] },
        settings: { template: 'foo' },
        placeholders: { bar: ['bar']}
    };
    assertEquals(new DefaultSpecification(mock)
        .compose(mock.settings.template), 'bar|baz');
});

Deno.test("DefaultSpecification - does not replace non-existing placeholder", () => {
    const mock: SpecificationData = { 
        vars: {foo: ['{{bar}}', 'baz'] },
        settings: { template: 'foo' },
        placeholders:{ moo: ['bar']}
    };
    assertEquals(new DefaultSpecification(mock)
        .compose(<string>mock.settings.template), '{{bar}}|baz');
});

Deno.test("DefaultSpecification - does not substitute placeholders edge case", () => {
    const mock: SpecificationData = { 
        vars: {foo: ['\\{{bar}}', 'baz'] },
        settings: { template: 'foo' },
        placeholders:{ bar: ['bar']}
    };
    assertEquals(new DefaultSpecification(mock)
        .compose(<string>mock.settings.template), '\\{{bar}}|baz');
});

Deno.test("DefaultSpecification - handles custom separator correctly", () => {
    const mock: SpecificationData = { 
        vars: { foo: ['bar','baz'] },
        settings: { template: 'foo', separator: '[: ]+' },
        placeholders: {}
    };
    assertEquals(new DefaultSpecification(mock)
        .compose(<string>mock.settings.template), 'bar[: ]+baz');
});

Deno.test("DefaultSpecification - handles custom template variable indicator correctly", () => {
    const mock: SpecificationData = { 
        vars: { foo: 'bar' },
        settings: { template: '#foo', symbol: '#' },
        placeholders: {}
    };
    assertEquals(new DefaultSpecification(mock)
        .compose(<string>mock.settings.template), 'bar');
});

Deno.test("DefaultSpecification - composes array of templates correctly", () => {
    const mock: SpecificationData = { 
        vars: { foo: 'bar', bar: 'baz' },
        settings: { template: ['foo', 'bar'] },
        placeholders: {}
    };
    assertEquals(new DefaultSpecification(mock)
        .compose(mock.settings.template[0]), 'bar');
    assertEquals(new DefaultSpecification(mock)
        .compose(mock.settings.template[1]), 'baz');
});
