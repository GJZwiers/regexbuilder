import { PatternSettings, PatternData } from '../pattern-data/interfaces.ts';
import { toList } from "../utils/to_list.ts";

interface UsesCustom {
    [key: string]: any;
}

interface SpecificationData extends UsesCustom {
    settings: PatternSettings;
    vars: PatternData;
}

abstract class SpecificationBase {
    protected var_symbol = this.data.settings.symbol ?? '';

    constructor(protected readonly data: SpecificationData) {}

    protected abstract buildLogic(templateParts: string[]): string;

    protected buildVar(val: string[] | string): string {
        return toList(val).join(this.data.settings.separator || '|');
    }
}

interface TemplateSpecification {
    compose(template: string): string;
}

class DefaultSpecification extends SpecificationBase implements TemplateSpecification {
    constructor(protected readonly data: SpecificationData) {
        super(data);
    }

    compose(template: string): string {
        const keys = Object.keys(this.data.vars).join('|');
        const parts = template.split(new RegExp(`([\\\\]?${this.var_symbol}(?:${keys}))`));
        return this.buildLogic(parts);
    }

    protected buildLogic(templateParts: string[]): string {      
        const escape = /^\\/;
        return templateParts.map(t => {
            if (escape.test(t)) return t.replace(escape, '');
            const key = t.replace(new RegExp(`^${this.var_symbol}`), '');
            const values = this.data.vars[key];
            if (!values) return t;
            return this.subPlaceholder(this.buildVar(values));
        }).join('');
    }

    protected subPlaceholder(group: string): string { 
        return group.replace(/(?<!\\)\{\{(\w+)\}\}/g, (match: string, name: string) => {
            if (!this.data.placeholders[name]) {
                console.warn(`(regexbuilder) Warning: undefined placeholder \"${name}\" in regex data`);
                return match;
            }
            return this.buildVar(this.data.placeholders[name]);
        });
    }
}

class SimpleSpecification extends SpecificationBase implements TemplateSpecification {
    constructor(protected readonly data: SpecificationData) {
        super(data);
    }

    compose(template: string): string {
        const keys = Object.keys(this.data.vars).join('|');
        const parts = template.split(new RegExp(`([\\\\]?${this.var_symbol}(?:${keys}))`));
        return this.buildLogic(parts);
    }

    protected buildLogic(templateParts: string[]): string {       
        const escape = /^\\/;
        return templateParts.map(t => {
            if (escape.test(t)) return t.replace(escape, '');
            const key = t.replace(new RegExp(`^${this.var_symbol}`), '');
            const values = this.data.vars[key];
            if (!values) return t;
            return this.buildVar(values);
        }).join('');
    }
}

export type { TemplateSpecification, SpecificationData }
export { DefaultSpecification, SimpleSpecification }