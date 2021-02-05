import { PatternData, PatternSettings } from '../pattern-data/interfaces.ts';
import { toList } from "../utils/toList.ts";

interface TemplateSpecification {
    compose(template: string): string;
}

interface UsesPlaceholders {
    placeholders: PatternData;
}

interface SpecificationData extends UsesPlaceholders {
    settings: PatternSettings;
    vars: PatternData;
}

abstract class SpecificationBase {
    constructor(protected readonly data: SpecificationData) { }
}

class DefaultSpecification extends SpecificationBase implements TemplateSpecification {
    protected var_symbol = (this.data.settings.symbol) ?? '';

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

    protected buildVar(val: string[] | string): string {
        return toList(val).join(this.data.settings.separator || '|');
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

export class SimpleSpecification extends SpecificationBase implements TemplateSpecification {
    private var_symbol = (this.data.settings.symbol) ?? '';

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

    protected buildVar(val: string[] | string): string {
        return toList(val).join(this.data.settings.separator || '|');
    }
}

export type { TemplateSpecification, SpecificationData }
export { DefaultSpecification }
