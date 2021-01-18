import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { DefaultSpecification } from "../template-spec/TemplateSpecification.ts";

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

Deno.test("DefaultSpecification - substitutes placeholders correctly", () => {
    let mockData = { foo: ['{{bar}}', 'baz'] };
    let mockSettings = { template: 'foo' };
    let mockPlaceholders = { bar: [ 'bar']}
    assertEquals(new DefaultSpecification(mockData, mockSettings, mockPlaceholders)
        .buildTemplate(mockSettings.template), 'bar|baz');
});

Deno.test("DefaultSpecification - handles custom separator correctly", () => {
    let mockData = { foo: ['bar', 'baz'] };
    let mockSettings = { template: 'foo', separator: '[: ]+' };
    assertEquals(new DefaultSpecification(mockData, mockSettings)
        .buildTemplate(mockSettings.template), 'bar[: ]+baz');
});
