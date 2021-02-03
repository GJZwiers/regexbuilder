import { PatternSettings, PatternData } from "../pattern-data/interfaces.ts";
import { ExtendedRegExp } from "../extended-regexp/ExtendedRegExp.ts";
import { PatternCrafter } from "./PatternCrafter.ts";
import { applyMixins } from '../utils/mixin.ts';
import { DefaultSpecification, SpecificationData, TemplateSpecification } from "../template-spec/TemplateSpecification.ts";
import { toList } from "../utils/toList.ts";

class Pattern {
    public settings: PatternSettings = {template:'',flags:''}
    public vars: PatternData = {}
    public placeholders: PatternData = {}
    /**
     * Starts construction of a new regular expression pattern through template and data definitions.
     */
    static new(): PatternBuilder {
        return new PatternBuilder();
    }
}

class PatternBuilderBase {
    protected readonly pattern: Pattern = new Pattern();
    /**
     * Builds the template into an extended regular expression object from the template variable data and the pattern settings.
     */
    build(): ExtendedRegExp {
        const specData = this.assembleData();
        const crafted = new PatternCrafter(new DefaultSpecification(specData), specData).craft();
        if (!crafted[0]) throw new Error('Something went wrong crafting the pattern');
        return crafted[0];
    }
    /**
     * Builds the templates into an array of extended regular expression objects from the template variable data and the pattern settings.
     */
    buildAll(): ExtendedRegExp[] {
        const specData = this.assembleData();
        return new PatternCrafter(new DefaultSpecification(specData), specData).craft(); 
    }

    protected assembleData(): SpecificationData {
        return {
            settings: this.pattern.settings,
            vars: this.pattern.vars,
            placeholders: this.pattern.placeholders || {}
        };
    }

    protected addTemplateGroup(target: string, data: string[] | string, input: string): void {
        this.setKey(target, data);
        this.changeTemplate(input);
    }

    private setKey(target: string, data: string[] | string): void {
        this.pattern.vars[target] = data;
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
     * Defines the settings for a pattern. This has to contain at minimum the template string used to build it.  
     * Optionally, one can specify regex flags, a custom character used for array joins (default `|`), or a custom symbol  
     * to indicate template variables with (default none).
     * 
     * Examples:
     * ```typescript
     *    .settings({ template: 'foo(bar)'});    // e.g. with .data({ foo: 'hello', bar: 'world'})
     * 
     *    .settings({ template: 'foobar', flags: 'g'});
     * 
     *    .settings({ template: '#foo #bar', symbol: '#'});
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
     * Adds a template string to build the pattern from. This is a convenience method for when you don't need to use any other settings except the template.
     * @param template 
     */
    template(template: string | string[]): this {
        this.pattern.settings.template = template;
        return this;
    }
}

class PatternDataBuilder extends PatternBuilderBase {
    /**
     * @deprecated
     * Defines the data for a pattern. Any name in the template string will be replaced with the contents 
     * of the equivalent name provided in this data.
     * 
     * Deprecated: use `vars()` instead.
     * @param data
     */
    data(data: PatternData): this {
        console.log(('(regexbuilder) DeprecationWarning: use of data() is deprecated. Please use vars() instead.'));
        this.pattern.vars = data;
        return this;
    }
    /**
     * Defines the data represented by the template variables of this pattern. Any name in the template string will be replaced with the values 
     * of the equivalent key provided. String arrays will be joined to regex alternates or a sequence with a custom separator if it's specified in the settings.
     * 
     * Examples:
     * 
     * ```typescript
     * .vars({ foo: 'bar'}) // As string data.
     * ```
     * 
     * ```typescript
     * .vars({ foo: ['bar','baz']}) // As a string array.
     * ```
     * 
     * ```typescript
     * .vars({ foo: '{{bar}}'}) // With placeholder syntax.
     * ```
     * 
     * ```typescript
     * .vars({ foo: 'bar', moo: ['baz','bal']}) // With a mix.
     * ```
     * @param vars
     */
    vars(vars: PatternData): this {
        this.pattern.vars = vars;
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
        let sym = this.pattern.settings.symbol ?? '';
        this.addTemplateGroup('filter', exclusions, `${sym}filter|($template)`);
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
        let sym = this.pattern.settings.symbol ?? '';
        this.addTemplateGroup('wildcard', wc, `$template|(${sym}wildcard)`);
        return this;
    }
}

class PatternBuilder {
    public pattern: Pattern = new Pattern();
    protected spec: TemplateSpecification

    constructor(spec?: TemplateSpecification) {
        this.spec = spec?? new DefaultSpecification({ 
            vars: this.pattern.vars, 
            settings: this.pattern.settings, 
            placeholders: this.pattern.placeholders
        });
    }
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
