import { RegexSettings, RegexData, RegexPlaceholders } from "./interfaces.ts";
import { ExtendedRegExp } from "./ExtendedRegExp.ts";
import { PatternCrafter } from "./PatternCrafter.ts";

class Pattern {
    public settings: RegexSettings = {template: '', flags: ''}
    public data: RegexData = {}
    public placeholders: RegexPlaceholders = {}

    static new(): PatternBuilder {
        return new PatternBuilder();
    }
}

abstract class RegexBuilder {
    protected reno: Pattern = new Pattern();

    build(): ExtendedRegExp[] {
        return new PatternCrafter().craft(this.reno);;
    }
}

class RegexSettingsBuilder<T extends RegexSettingsBuilder<T>>
    extends RegexBuilder {

    settings(settings: RegexSettings): T {
        this.reno.settings = settings;
        return <T><unknown>this;
    }
}

class RegexDataBuilder<T extends RegexDataBuilder<T>>
    extends RegexSettingsBuilder<RegexDataBuilder<T>> {
    
    data(data: RegexData): T {
        this.reno.data = data;
        return <T><unknown>this;
    }
}

class RegexPlaceholderBuilder<T extends RegexPlaceholderBuilder<T>>
    extends RegexDataBuilder<RegexPlaceholderBuilder<T>> {

    placeholders(ph: RegexPlaceholders): T {
        this.reno.placeholders = ph;
        return <T><unknown>this;
    }
}

class RegexExclusionBuilder<T extends RegexExclusionBuilder<T>>
    extends RegexPlaceholderBuilder<RegexExclusionBuilder<T>> {

    except(exclusions: string[]): T {
        this.reno.data['exclude'] = exclusions;
        if (typeof this.reno.settings.template === 'string') {
            this.reno.settings.template = `exclude|(${this.reno.settings.template})`;
        } else { // if string
            for (let i = 0; i < this.reno.settings.template.length; i++) {
                this.reno.settings.template[i] = `exclude|(${this.reno.settings.template[i]})`;
            }
        }

        return <T><unknown>this;
    }
}

class PatternBuilder extends RegexExclusionBuilder<PatternBuilder> { }

function main(): void {
    let pattern = Pattern.new()
        .settings({
            template: '(greetings) (?=environments)'
        })
        .data({
            greetings: [ 'Hello', 'Good Morning', 'Ciao' ],
            environments: [ 'World', 'New York', '{{foo}}' ]
        })
        .placeholders({ foo: ['Italy'] })
        .except(['Sup', 'What is up'])
        .build();

    console.log(pattern[0]);
}

main();

export { Pattern, PatternBuilder }