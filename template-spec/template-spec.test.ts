import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { DefaultSpecification, SpecificationData } from "../template-spec/TemplateSpecification.ts";

Deno.test("DefaultSpecification - builds template from data correctly", () => {
    let mock = { 
        vars: { foo: 'bar'}, 
        settings: { template: 'foo' },
        placeholders: {}
    };
    let spec = new DefaultSpecification(mock);
    assertEquals(spec.compose(mock.settings.template), 'bar');
});

Deno.test("DefaultSpecification - joins arrays correctly", () => {
    let mock = {
        vars: { foo: ['bar','baz'] },
        settings: { template: 'foo' },
        placeholders: {}
    };

    assertEquals(new DefaultSpecification(mock)
        .compose(<string>mock.settings.template), 'bar|baz');
});

Deno.test("DefaultSpecification - substitutes placeholders correctly", () => {
    let mock = { 
        vars: {foo: ['{{bar}}', 'baz'] },
        settings: { template: 'foo' },
        placeholders: { bar: ['bar']}
    };
    assertEquals(new DefaultSpecification(mock)
        .compose(mock.settings.template), 'bar|baz');
});

Deno.test("DefaultSpecification - does not substitute placeholders edge case", () => {
    let mock: SpecificationData = { 
        vars: {foo: ['\\{{bar}}', 'baz'] },
        settings: { template: 'foo' },
        placeholders:{ bar: ['bar']}
    };
    assertEquals(new DefaultSpecification(mock)
        .compose(<string>mock.settings.template), '\\{{bar}}|baz');
});

Deno.test("DefaultSpecification - handles custom separator correctly", () => {
    let mock: SpecificationData = { 
        vars: { foo: ['bar','baz'] },
        settings: { template: 'foo', separator: '[: ]+' },
        placeholders: {}
    };
    assertEquals(new DefaultSpecification(mock)
        .compose(<string>mock.settings.template), 'bar[: ]+baz');
});

Deno.test("DefaultSpecification - handles custom template variable indicator correctly", () => {
    let mock: SpecificationData = { 
        vars: { foo: 'bar' },
        settings: { template: '#foo', symbol: '#' },
        placeholders: {}
    };
    assertEquals(new DefaultSpecification(mock)
        .compose(<string>mock.settings.template), 'bar');
});
