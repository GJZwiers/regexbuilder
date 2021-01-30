import { PatternData, PatternSettings } from '../pattern-data/interfaces.ts';
import { toList } from "../utils/toList.ts";

interface TemplateSpecification {
    buildTemplate(template: string): string;
}

interface UsesPlaceholders {
    placeholders: PatternData;
}

interface SpecificationData extends UsesPlaceholders {
    settings: PatternSettings;
    data: PatternData;
}

abstract class SpecificationBase {
    constructor(protected data: SpecificationData) {}
}

class DefaultSpecification extends SpecificationBase implements TemplateSpecification {
    constructor(protected data: SpecificationData) {
        super(data);
    }

    buildTemplate(template: string): string {
        const var_symbol = (this.data.settings.symbol) ?? '';
        for (let var_name in this.data.data) {
            template = template.replace(
                new RegExp(`${var_symbol}${var_name}(?=\\W|$)`, 'g'),
                this.subPlaceholder(this.buildGroup(this.data.data[var_name]))
            );
        }
        return template;
    }

    protected buildGroup(group: string[] | string): string {
        return toList(group).join(this.data.settings.separator || '|');
    }

    protected subPlaceholder(group: string): string {
        return group.replace(/(?<!\\)\{\{(\w+)\}\}/g, (match: string, name: string) => {
            if (!this.data.placeholders[name]) {
                console.log(`(regexbuilder) Warning: undefined placeholder ${name} in regex data`);
                return match;
            }
            return this.buildGroup(this.data.placeholders[name]);
        });
    }
}

export type { TemplateSpecification, SpecificationData }
export { DefaultSpecification }
