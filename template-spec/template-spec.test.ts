import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { DefaultSpecification, SpecificationData } from "../template-spec/TemplateSpecification.ts";
import { PatternSettings } from "../pattern-data/interfaces.ts"

Deno.test("DefaultSpecification - builds template from data correctly", () => {
    let mock = { 
        data: { foo: 'bar'}, 
        settings: { template: 'foo' },
        placeholders: {}
    };
    let spec = new DefaultSpecification(mock);
    assertEquals(spec.buildTemplate(mock.settings.template), 'bar');
});

Deno.test("DefaultSpecification - joins arrays correctly", () => {
    let mock = {
        data: { foo: ['bar','baz'] },
        settings: { template: 'foo' },
        placeholders: {}
    };

    assertEquals(new DefaultSpecification(mock)
        .buildTemplate(<string>mock.settings.template), 'bar|baz');
});

Deno.test("DefaultSpecification - substitutes placeholders correctly", () => {
    let mock = { 
        data: {foo: ['{{bar}}', 'baz'] },
        settings: { template: 'foo' },
        placeholders: { bar: ['bar']}
    };
    assertEquals(new DefaultSpecification(mock)
        .buildTemplate(mock.settings.template), 'bar|baz');
});

Deno.test("DefaultSpecification - does not substitute placeholders edge case", () => {
    let mock: SpecificationData = { 
        data: {foo: ['\\{{bar}}', 'baz'] },
        settings: { template: 'foo' },
        placeholders:{ bar: ['bar']}
    };
    assertEquals(new DefaultSpecification(mock)
        .buildTemplate(<string>mock.settings.template), '\\{{bar}}|baz');
});

Deno.test("DefaultSpecification - handles custom separator correctly", () => {
    let mock: SpecificationData = { 
        data: { foo: ['bar','baz'] },
        settings: { template: 'foo', separator: '[: ]+' },
        placeholders: {}
    };
    assertEquals(new DefaultSpecification(mock)
        .buildTemplate(<string>mock.settings.template), 'bar[: ]+baz');
});

Deno.test("DefaultSpecification - handles custom template variable indicator correctly", () => {
    let mock: SpecificationData = { 
        data: { foo: 'bar' },
        settings: { template: '#foo', symbol: '#' },
        placeholders: {}
    };
    assertEquals(new DefaultSpecification(mock)
        .buildTemplate(<string>mock.settings.template), 'bar');
});
