import { PatternSettings, PatternData, PatternPlaceholders } from "../pattern-data/interfaces.ts";
import { ExtendedRegExp } from "../ExtendedRegExp.ts";
import { PatternCrafter } from "./PatternCrafter.ts";

class Pattern {
    public settings: PatternSettings = {template: '', flags: ''}
    public data: PatternData = {}
    public placeholders: PatternPlaceholders = {}

    static new(): PatternBuilder {
        return new PatternBuilder();
    }
}

abstract class PatternBuilderBase {
    protected pattern: Pattern = new Pattern();

    build(): ExtendedRegExp[] {
        return new PatternCrafter().craft(this.pattern);
    }
}

class PatternSettingsBuilder<T extends PatternSettingsBuilder<T>>
    extends PatternBuilderBase {

    settings(settings: PatternSettings): T {
        this.pattern.settings = settings;
        return <T><unknown>this;
    }
}

class PatternDataBuilder<T extends PatternDataBuilder<T>>
    extends PatternSettingsBuilder<PatternDataBuilder<T>> {
    
    data(data: PatternData): T {
        this.pattern.data = data;
        return <T><unknown>this;
    }
}

class PatternPlaceholderBuilder<T extends PatternPlaceholderBuilder<T>>
    extends PatternDataBuilder<PatternPlaceholderBuilder<T>> {

    placeholders(ph: PatternPlaceholders): T {
        this.pattern.placeholders = ph;
        return <T><unknown>this;
    }
}

class PatternExclusionBuilder<T extends PatternExclusionBuilder<T>>
    extends PatternPlaceholderBuilder<PatternExclusionBuilder<T>> {

    except(exclusions: string[]): T {
        this.pattern.data['exclude'] = exclusions;
        if (typeof this.pattern.settings.template === 'string') {
            this.pattern.settings.template = `exclude|(${this.pattern.settings.template})`;
        } else { // if array
            for (let i = 0; i < this.pattern.settings.template.length; i++) {
                this.pattern.settings.template[i] = `exclude|(${this.pattern.settings.template[i]})`;
            }
        }

        return <T><unknown>this;
    }
}

class PatternWildcardBuilder<T extends PatternWildcardBuilder<T>>
    extends PatternExclusionBuilder<PatternWildcardBuilder<T>> {

    wildcard(wc: string): T {
        this.pattern.data['wildcard'] = wc;
        if (typeof this.pattern.settings.template === 'string') {
            this.pattern.settings.template = `${this.pattern.settings.template}|(wildcard)`;
        } else {
            for (let i = 0; i < this.pattern.settings.template.length; i++) {
                this.pattern.settings.template[i] = `${this.pattern.settings.template[i]}|(wildcard)`;
            }
        }
        return <T><unknown>this;
    }
}

class PatternBuilder extends PatternWildcardBuilder<PatternBuilder> { }

export { Pattern, PatternBuilder }