import { PatternSettings, PatternData } from "../pattern-data/interfaces.ts";
import { PatternCrafter } from "./patterncrafter.ts";
import { ExtendedRegExp } from "../extended-regexp/extended_regexp.ts";
import { TemplateSpecification, DefaultSpecification, SpecificationData } from "../template-spec/template_specification.ts";
import { applyMixins } from '../utils/mixin.ts';
import { toList } from "../utils/to_list.ts";

class Pattern {
    settings: PatternSettings = {template:''};
    vars: PatternData = {};
    placeholders: PatternData = {};
    /** Starts construction of a new pattern. */
    static new(): PatternBuilder {
        return new PatternBuilder();
    }
}

abstract class PatternBuilderBase {
    readonly pattern: Pattern = new Pattern();
    /** Builds the template into an extended regex object using the pattern's settings. */
    build(spec?: new (...args: any[]) => TemplateSpecification): ExtendedRegExp {
        const specData = this.assembleData();
        const specification = this.pickSpecification(specData, spec);

        const crafted = new PatternCrafter(specification, specData).craft();
        if (crafted.length === 0) throw new Error('Something went wrong crafting the pattern');
        return crafted[0];
    }
    /** Builds the templates into a list of extended regex objects using the pattern's settings. */
    buildAll(spec?: new (...args: any[]) => TemplateSpecification): ExtendedRegExp[] {
        const specData = this.assembleData();
        const specification = this.pickSpecification(specData, spec);
        return new PatternCrafter(specification, specData).craft(); 
    }

    protected assembleData(): SpecificationData {
        return {
            settings: this.pattern.settings,
            vars: this.pattern.vars,
            placeholders: this.pattern.placeholders || {}
        };
    }

    protected pickSpecification(data: SpecificationData, spec?: new (...args: any[]) => TemplateSpecification) {
       return (spec) ? new spec(data) : new DefaultSpecification(data);
    }

    protected addTemplateVariable(target: string, data: string[] | string, input: string): void {
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
     * 
     *      .settings({ template: 'foo(bar)'});
     * 
     *      .settings({ template: 'foobar', flags: 'g'});
     * 
     *      .settings({ template: '#foo #bar', symbol: '#'});
     * 
     *      .settings({
     *        template: ['foo(bar)','(bar)foo'],
     *        separator: '|'  
     *       });
     */
    settings(settings: PatternSettings): this {
        this.pattern.settings = settings;
        return this;
    }
    /** Adds a template string to build the pattern from. Use this method for faster building when you're not using any other settings. */
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
     * Deprecated: use `vars()` instead.
     */
    data(data: PatternData): this {
        console.log(('(regexbuilder) DeprecationWarning: use of data() is deprecated. Please use vars() instead.'));
        this.pattern.vars = data;
        return this;
    }
    /**
     * Defines the template variables for this pattern. Any name in the template string will be replaced with the values 
     * of the key provided here. String arrays will be joined with a `|` or with a custom separator if specified in the settings. 
     * 
     * Placeholders can be defined with `{{myPlaceholder}}` and their values can be added with `placeholder()`.
     * 
     * Examples:
     * 
     *       .vars({ foo: 'bar' })
     * 
     *       .vars({ foo: ['bar','baz'] })
     * 
     *       .vars({ foo: '{{bar}}' })
     * 
     *       .vars({ foo: 'bar', moo: ['{{baz}}','bal'] })
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
     * 
     *       .placeholders({ foo: 'bar' })
     * 
     *       .placeholders({ foo: ['bar', 'baz'] })
     */
    placeholders(placeholders: PatternData): this {
        this.pattern.placeholders = placeholders;
        return this;
    }
}

class PatternFilterBuilder extends PatternBuilderBase {
    /**
     * @experimental
     * Defines one or more values to except for a regex search. Note this will change existing template structure
     * to `exclude|(the_rest_of_the_template)`. Exceptions _will be matched but placed in index 0 of the matches array only_.
     * Desired matches will be placed in capturing group 1 instead.
     */
    filter(exceptions: string | string[]): this {
        const symbol = this.pattern.settings.symbol ?? '';
        this.addTemplateVariable('filter', exceptions, `${symbol}filter|($template)`);
        return this;
    }
    /** Alias for `filter()`. */
    except(exceptions: string | string[]): this {
        this.filter(exceptions);
        return this;
    }
}

class PatternWildCardBuilder extends PatternBuilderBase {
    /**
     * @experimental
     * Defines a wildcard match to be used after searching for known values. Note this will change existing template structure to 
     * `the_rest_of_the_template|(wildcard)`, adding a capturing group but not changing the order of ones already present.
     */
    wildcard(wildcard: string | string[]): this {
        const symbol = this.pattern.settings.symbol ?? '';
        this.addTemplateVariable('wildcard', wildcard, `$template|(${symbol}wildcard)`);
        return this;
    }
}

class PatternBuilder {
    readonly pattern: Pattern = new Pattern();
}

interface PatternBuilder extends 
    PatternBuilderBase,
    PatternSettingsBuilder,
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
