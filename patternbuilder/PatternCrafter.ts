import { ExtendedRegExp } from '../extended-regexp/ExtendedRegExp.ts';
import { DefaultSpecification, TemplateSpecification } from '../template-spec/TemplateSpecification.ts';
import { Pattern } from './Pattern.ts'

class PatternCrafter {
    craft(pattern: Pattern): ExtendedRegExp[] {
        if (typeof pattern.settings.template === 'string') {
            pattern.settings.template = [pattern.settings.template];
        }
        
        const tm = new PatternMaker(new DefaultSpecification(
            pattern.data, pattern.settings, pattern.placeholders));
        const patterns = tm.build(pattern.settings.template, pattern.settings.flags ?? '');

        if (patterns.length > 1) {
            let regexes = [];
            for (let pattern of patterns) {
                let re = this.compilePattern(pattern);
                regexes.push(re);
            }
            return regexes;
        }
     
        return [this.compilePattern(patterns[0])];
    }

    private compilePattern(pattern: ReObject): ExtendedRegExp {
        return new ExtendedRegExp(pattern.regex, pattern.template);
    }
}

interface ReObject {
    regex: RegExp,
    template: string
}

class PatternMaker {
    private spec: TemplateSpecification;

    constructor(spec: TemplateSpecification) {
        this.spec = spec;
    }

    build(templates: string[], flags: string) : Array<ReObject> {
        const regexes: Array<ReObject> = [];
        for (let template of templates) {
            const regexString = this.spec.buildTemplate(template);
            
            const regex = this.buildRegex(regexString, flags, template);
            regexes.push(regex);
        }
        return regexes;
    }

    private buildRegex(regexString: string, flags: string, template: string): ReObject {
        return { regex: new RegExp(regexString, flags), template };
    }
}

export { PatternCrafter }
export type { ReObject }