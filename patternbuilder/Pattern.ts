import { PatternSettings, PatternData } from "../pattern-data/interfaces.ts";
import { ExtendedRegExp } from "../extended-regexp/ExtendedRegExp.ts";
import { PatternCrafter } from "./PatternCrafter.ts";
import { applyMixins } from '../utils/mixin.ts';
import { DefaultSpecification, SpecificationData } from "../template-spec/TemplateSpecification.ts";
import { toList } from "../utils/toList.ts";

class Pattern {
    public settings: PatternSettings = {template:'',flags:''}
    public data: PatternData = {}
    public placeholders: PatternData = {}
    /**
     * Starts construction of a new regular expression pattern through template and data definitions.
     */
    static new(): PatternBuilder {
        return new PatternBuilder();
    }
}

class PatternBuilderBase {
    protected pattern: Pattern = new Pattern();

    build(): ExtendedRegExp[] {
        const specData: SpecificationData = {
            settings: this.pattern.settings,
            data: this.pattern.data,
            placeholders: this.pattern.placeholders || {}
        };
        return new PatternCrafter(new DefaultSpecification(specData), specData).craft();
    }

    protected addTemplateGroup(target: string, data: string[] | string, input: string): void {
        this.setKey(target, data);
        this.changeTemplate(input);
    }

    private setKey(target: string, data: string[] | string): void {
        this.pattern.data[target] = data;
    }

    private changeTemplate(value: string): void {
        this.pattern.settings.template = toList(this.pattern.settings.template)
            .map((t, i, template) => {
            return template[i] = value.replace('$template', t);
        });
    }
}

class PatternSettingsBuilder extends PatternBuilderBase {
    /**
     * Defines the settings for a pattern. This has to contain at minimum the template string used in building it.  
     * Optionally, one can specify regex flags, a custom character used for array joins (default `|`), or a custom symbol  
     * to indicate template variables with (default none).
     * 
     * Some examples:
     * ```typescript
     *    .settings({ template: 'foo(bar)'});    // e.g. with .data({ foo: 'hello', bar: 'world'})
     * 
     *    .settings({ template: 'foobar', flags: 'g'});
     * 
     *    .settings({
     *      template: ['foo(bar)','(bar)foo'],  // e.g. with .data({ foo: ['hello', 'hi', 'howdy'], bar: 'world'})
     *      separator: '|'  
     *     });
     * ```
     * @param settings 
     */
    settings(settings: PatternSettings): this {
        this.pattern.settings = settings;
        return this;
    }
    /**
     * @experimental
     * @param template 
     */
    addTemplate(template: string): this {
        this.pattern.settings.template = template;
        return this;
    }
    /**
     * @experimental
     * @param flags 
     */
    addFlags(flags: string): this {
        this.pattern.settings.flags = flags;
        return this;
    }  
}

class PatternDataBuilder extends PatternBuilderBase {
    /**
     * Defines the data for a pattern. Any name in the template string will be replaced with the contents 
     * of the equivalent name provided in this data.
     * @param data
     */
    data(data: PatternData): this {
        this.pattern.data = data;
        return this;
    }
}

class PatternPlaceholderBuilder extends PatternBuilderBase {
    /**
     * Defines the data used to substitute placeholder syntax in the template `{{myPlaceholder}}`.
     * For example, if you add a placeholder `{{foo}}` to the data, add a key `foo` to this data with the values to replace it with.
     * ```typescript
     * .placeholders({ foo: 'bar' })
     * ```
     * @param ph 
     */
    placeholders(ph: PatternData): this {
        this.pattern.placeholders = ph;
        return this;
    }
}

class PatternFilterBuilder extends PatternBuilderBase {
    /**
     * @experimental
     * Defines one or more values to except for a regex search. Note this will change existing template structure
     * to `exclude|(the_rest_of_the_template)`. Exceptions _will be matched but placed in index 0 of the matches array only_.
     * Desired matches will be placed in capturing group 1 instead.
     * @param exclusions 
     */
    filter(exclusions: string | string[]): this {
        this.addTemplateGroup('filter', exclusions, `filter|($template)`);
        return this;
    }
}

class PatternWildCardBuilder extends PatternBuilderBase {
    /**
     * @experimental
     * Defines a wildcard match to be used after searching for known values. Note this will change existing template structure to 
     * `the_rest_of_the_template|(wildcard)`, adding a capturing group but not changing the order of ones already present.
     * @param wc 
     */
    wildcard(wc: string | string[]): this {
        this.addTemplateGroup('wildcard', wc, `$template|(wildcard)`);
        return this;
    }
}

class PatternBuilder {
    public pattern: Pattern = new Pattern();
}

interface PatternBuilder extends PatternSettingsBuilder,
    PatternDataBuilder,
    PatternPlaceholderBuilder,
    PatternFilterBuilder,
    PatternWildCardBuilder {
}

applyMixins(PatternBuilder, [
    PatternBuilderBase,
    PatternSettingsBuilder,
    PatternDataBuilder,
    PatternPlaceholderBuilder,
    PatternFilterBuilder,
    PatternWildCardBuilder
]);

export { Pattern, PatternBuilder }
