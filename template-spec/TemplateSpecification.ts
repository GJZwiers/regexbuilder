import { PatternData, PatternSettings, PatternPlaceholders } from '../pattern-data/interfaces.ts';

interface TemplateSpecification {
    buildTemplate(template: string) : string;
}

abstract class SpecificationBase {
    constructor(protected data: PatternData, protected settings: PatternSettings) { }
}

class DefaultSpecification extends SpecificationBase implements TemplateSpecification {
    private placeholders: PatternPlaceholders;

    constructor(data: PatternData, settings: PatternSettings, placeholders?: PatternPlaceholders) {
        super(data, settings);
        this.placeholders = placeholders || {};
    }

    buildTemplate(template: string) : string {
        for (const name in this.data) {
            const group = this.subPlaceholder(this.buildGroup(this.data[name]));
            template = template.replace(new RegExp(`${name}(?=\\W|$)`, 'g'), group);
        }
        return template;
    }

    protected buildGroup(group: string[] | string) : string {
        return (Array.isArray(group)) ? group.join(this.settings.separator || '|') : group;
    }

    protected subPlaceholder(group: string) : string {
        return group.replace(/\{\{(\w+)\}\}/, (match: string, p1: string) => {
            if (!this.placeholders[p1]) {
                throw new Error(`undefined placeholder ${match} in regex data`);
            }
            return this.buildGroup(this.placeholders[p1]);
        });
    }
}

export type { TemplateSpecification }
export { DefaultSpecification }
