import { ExtendedRegExp } from '../extended-regexp/ExtendedRegExp.ts';
import { SpecificationData, TemplateSpecification } from '../template-spec/TemplateSpecification.ts';
import { toList } from '../utils/toList.ts';

class PatternCrafter {
    constructor(private spec: TemplateSpecification, private data: SpecificationData) {}

    craft(): ExtendedRegExp[] {
        return toList(this.data.settings.template)
        .map(template => { return new ExtendedRegExp(
            new RegExp(
                this.spec.buildTemplate(template), 
                this.data.settings.flags ?? ''),
            template);
        });
    }
}

export { PatternCrafter }
