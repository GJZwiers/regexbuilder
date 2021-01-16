class Regex {
    public parts: Array<string> = []
    public flags: string = ''

    static new(): RegexBuilder {
        return new RegexBuilder();
    }

    compile(): RegExp {
        return new RegExp(this.parts.join(''));
    }
}

abstract class RegexBuilderBase {
    protected pattern: Regex = new Regex();

    build(): RegExp {
        return this.pattern.compile();
    }
}

class PatternPartBuilder<T extends PatternPartBuilder<T>>
    extends RegexBuilderBase {

    part(part: string): T {
        this.pattern.parts.push(part);
        return <T><unknown>this;
    }
}

class PatternGroupBuilder<T extends PatternPartBuilder<T>>
    extends PatternPartBuilder<PatternGroupBuilder<T>> {
    
    capture(cg: string): T {
        this.pattern.parts.push('(', cg, ')');
        return <T><unknown>this;
    }

    noncapture(ncg: string): T {
        this.pattern.parts.push('(?:', ncg, ')');
        return <T><unknown>this;
    }

    lookahead(la: string): T {
        this.pattern.parts.push('(?=', la, ')');
        return <T><unknown>this;
    }

    lookbehind(lb: string): T {
        this.pattern.parts.push('(?<=', lb, ')');
        return <T><unknown>this;
    }

    group(type: 'cg' | 'ncg' | 'la' | 'nla' | 'lb' | 'nlb', group: string) {
        let grouptype = '';
        if (type === 'cg') {
            grouptype = '(';
        } else if (type === 'ncg') {
            grouptype = '(?:'
        } else if (type === 'la') {
            grouptype = '(?='
        } else if (type === 'lb') {
            grouptype = '(?<='
        } else if (type === 'nla') {
            grouptype = '(?!'
        } else if (type === 'nlb') {
            grouptype = '(?<!'
        }

        this.pattern.parts.push(grouptype, group, ')');
        return <T><unknown>this;
    }

    namedGroup(name: string, group: string): T {
        this.pattern.parts.push('(?<', name, '>', group, ')');
        return <T><unknown>this;
    }
}

class RegexBuilder extends PatternGroupBuilder<RegexBuilder> { }

export { Regex, RegexBuilder }