import { PatternSettings, PatternData } from "../pattern-data/interfaces.ts";
import { ExtendedRegExp } from "../extended-regexp/ExtendedRegExp.ts";
import { PatternCrafter } from "./PatternCrafter.ts";
import { applyMixins } from '../utils/mixin.ts';

class Pattern {
    public settings: PatternSettings = {template: '', flags: ''}
    public data: PatternData = {}
    public placeholders: PatternData = {}

    static new(): PatternBuilder {
        return new PatternBuilder();
    }
}

class PatternBuilderBase {
    protected pattern: Pattern = new Pattern();

    build(): ExtendedRegExp[] {
        return new PatternCrafter().craft(this.pattern);
    }

    protected addTemplateGroup(target: string, data: string[] | string, input: string): void {
        this.setKey(target, data);
        this.changeTemplate(input);
    }

    private setKey(target: string, data: string[] | string) {
        this.pattern.data[target] = data;
    }

    private changeTemplate(value: string): void {
        if (typeof this.pattern.settings.template === 'string') {
            this.pattern.settings.template = value.replace('$template', this.pattern.settings.template);
            return;
        }
        this.pattern.settings.template.forEach((elt, i, tmpl) => {
            return tmpl[i] = value.replace('$template', elt);
        });
    }
}

class PatternSettingsBuilder extends PatternBuilderBase {
    settings(settings: PatternSettings): this {
        this.pattern.settings = settings;
        return this;
    }
}

class PatternDataBuilder extends PatternBuilderBase {
    data(data: PatternData): this {
        this.pattern.data = data;
        return this;
    }
}

class PatternPlaceholderBuilder extends PatternBuilderBase {
    placeholders(ph: PatternData): this {
        this.pattern.placeholders = ph;
        return this;
    }
}

class PatternExclusionBuilder extends PatternBuilderBase {
    except(exclusions: string | string[]): this {
        this.addTemplateGroup('exclude', exclusions, `exclude|($template)`);
        return this;
    }
}

class PatternWildCardBuilder extends PatternBuilderBase {
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
    PatternExclusionBuilder,
    PatternWildCardBuilder {
}

applyMixins(PatternBuilder, [
    PatternBuilderBase,
    PatternSettingsBuilder,
    PatternDataBuilder,
    PatternPlaceholderBuilder,
    PatternExclusionBuilder,
    PatternWildCardBuilder
]);

export { Pattern, PatternBuilder }