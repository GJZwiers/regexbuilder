import { PatternSettings, PatternData, PatternPlaceholders } from "../pattern-data/interfaces.ts";
import { ExtendedRegExp } from "../ExtendedRegExp.ts";
import { PatternCrafter } from "./PatternCrafter.ts";
import { applyMixins } from '../utils/mixin.ts';

class Pattern {
    public settings: PatternSettings = {template: '', flags: ''}
    public data: PatternData = {}
    public placeholders: PatternPlaceholders = {}

    static new(): PatternBuilder {
        return new PatternBuilder();
    }
}

class PatternBuilderBase {
    public pattern: Pattern = new Pattern();

    build(): ExtendedRegExp[] {
        return new PatternCrafter().craft(this.pattern);
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
    placeholders(ph: PatternPlaceholders): this {
        this.pattern.placeholders = ph;
        return this;
    }
}

class PatternExclusionBuilder extends PatternBuilderBase {
    except(exclusions: string[]): this {
        this.pattern.data['exclude'] = exclusions;
        if (typeof this.pattern.settings.template === 'string') {
            this.pattern.settings.template = `exclude|(${this.pattern.settings.template})`;
        } else { // if array
            for (let i = 0; i < this.pattern.settings.template.length; i++) {
                this.pattern.settings.template[i] = `exclude|(${this.pattern.settings.template[i]})`;
            }
        }

        return this;
    }
}

class PatternWildCardBuilder extends PatternBuilderBase {
    wildcard(wc: string): this {
        this.pattern.data['wildcard'] = wc;
        if (typeof this.pattern.settings.template === 'string') {
            this.pattern.settings.template = `${this.pattern.settings.template}|(wildcard)`;
        } else {
            for (let i = 0; i < this.pattern.settings.template.length; i++) {
                this.pattern.settings.template[i] = `${this.pattern.settings.template[i]}|(wildcard)`;
            }
        }
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
    PatternWildCardBuilder {}

applyMixins(PatternBuilder, [
    PatternBuilderBase,
    PatternSettingsBuilder,
    PatternDataBuilder,
    PatternPlaceholderBuilder,
    PatternExclusionBuilder,
    PatternWildCardBuilder
]);

export { Pattern, PatternBuilder }