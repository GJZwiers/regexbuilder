import { ExtendedRegExp } from '../extended-regexp/extended_regexp.ts';
import { SpecificationData, TemplateSpecification } from '../template-spec/template_specification.ts';
import { toList } from '../utils/to_list.ts';

class PatternCrafter {
    constructor(private readonly spec: TemplateSpecification, private readonly data: SpecificationData) {}

    craft(): ExtendedRegExp[] {
        return toList(this.data.settings.template)
        .map(template => { return new ExtendedRegExp(
            new RegExp(
                this.spec.compose(template), 
                this.data.settings.flags ?? ''),
            template,
            this.data.settings.map ?? false);
        });
    }
}

export { PatternCrafter }