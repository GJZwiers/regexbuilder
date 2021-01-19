import { applyMixins } from '../utils/mixin.ts';

type groupCode = 'cg' | 'ncg' | 'la' | 'nla' | 'lb' | 'nlb';

function processGroupCode(type: groupCode): string {
    if (type === 'cg') {
        return '(';
    } else if (type === 'ncg') {
        return '(?:';
    } else if (type === 'la') {
        return '(?=';
    } else if (type === 'lb') {
        return '(?<=';
    } else if (type === 'nla') {
        return '(?!';
    } else if (type === 'nlb') {
        return '(?<!';
    } else {
        throw new Error(`Invalid group code: ${type}`)
    }
}

class Regex {
    public parts: Array<string> = [];
    public flags: string = '';

    static new(): RegexBuilder {
        return new RegexBuilder();
    }

    compile(): RegExp {
        return new RegExp(this.parts.join(''), this.flags);
    }
}

abstract class RegexBuilderBase {
    public pattern: Regex = new Regex();
    public nests = 0;

    build(): RegExp {
        if (this.nests > 0) {
            throw new Error("Unfinished nest in pattern.");
        }
        return this.pattern.compile();
    }
}

class FlagsBuilder extends RegexBuilderBase {
    flags(flags: string): this {
        this.pattern.flags = flags;
        return this;
    }
}

class PatternPartBuilder extends RegexBuilderBase {
    add(part: string): this {
        this.pattern.parts.push(part);
        return this;
    }
}

class PatternGroupBuilder extends RegexBuilderBase {
    capture(cg: string): this {
        this.pattern.parts.push('(', cg, ')');
        return this;
    }

    noncapture(ncg: string): this {
        this.pattern.parts.push('(?:', ncg, ')');
        return this;
    }

    group(type: groupCode, group: string) {
        let grouptype = processGroupCode(type);
        this.pattern.parts.push(grouptype, group, ')');
        return this;
    }

    namedGroup(name: string, group: string): this {
        this.pattern.parts.push('(?<', name, '>', group, ')');
        return this;
    }
}

class PatternAssertionBuilder extends RegexBuilderBase {
    lineStart(): this {
        this.pattern.parts.push('^');
        return this;
    }

    lineEnd(): this {
        this.pattern.parts.push('$');
        return this;
    }
    
    /**
     * Combines RegexBuilder methods lineStart() and add(...).
     * @param start 
     */
    startsWith(start: string): this {
        this.pattern.parts.push('^', start);
        return this;
    }

    /**
     * Combines RegexBuilder methods add(...) and lineEnd().
     * @param start 
     */
    endsWith(end: string): this {
        this.pattern.parts.push(end, '$');
        return this;
    }

    lookahead(la: string): this {
        this.pattern.parts.push('(?=', la, ')');
        return this;
    }

    lookbehind(lb: string): this {
        this.pattern.parts.push('(?<=', lb, ')');
        return this;
    }

    negatedLA(la: string): this {
        this.pattern.parts.push('(?!', la, ')');
        return this;
    }

    negatedLB(lb: string): this {
        this.pattern.parts.push('(?<!', lb, ')');
        return this;
    }

    followedBy(la: string): this {
        return this.lookahead(la);
    }

    notFollowedBy(la: string): this {
        return this.negatedLA(la);
    }

    precededBy(lb: string): this {
        return this.lookbehind(lb);
    }

    notPrecededBy(lb: string): this {
        return this.negatedLB(lb);
    }
}

class PatternAlternationBuilder extends RegexBuilderBase {
    alts(alts: string[]): this {
        this.pattern.parts.push(alts.join('|'));
        return this;
    }

    altGroup(alts: string[], code: groupCode): this {
        let grouptype = processGroupCode(code);
        this.pattern.parts.push(grouptype, alts.join('|'), ')')
        return this;
    }
}

class RegexClassBuilder extends RegexBuilderBase {
    class(content: string): this {
       this.pattern.parts.push('[', content, ']'); 
       return this;
    }

    negatedClass(content: string): this {
        this.pattern.parts.push('[^', content, ']'); 
        return this;
     }
}

class RegexQuantifierBuilder extends RegexBuilderBase {
    /**
     * Adds an N quantifier {n}.
     * @param n 
     */
    times(n: number): this {
        this.checkDouble();
        this.pattern.parts.push(`{${n}}`);
        return this;
    } 

    /**
     * Adds an N to M range quantifier {n,m}.
     * @param n 
     * @param m 
     */
    between(n: number, m: number): this {
        this.checkDouble();
        this.pattern.parts.push(`{${n},${m}}`);
        return this;
    }

    /**
     * Adds an N or more quantifier {n,}.
     * @param n 
     */
    atleast(n: number): this {
        this.checkDouble();
        this.pattern.parts.push(`{${n},}`);
        return this;
    }

    onePlus(): this {
        this.checkDouble();
        this.pattern.parts.push(`+`);
        return this;
    }

    zeroPlus(): this {
        this.checkDouble();
        this.pattern.parts.push(`*`);
        return this;
    }

    private checkDouble() {
        let lastElement = this.pattern.parts.length - 1;
        if (/\{\d\}|\{\d,\s?\d\}$/.test(this.pattern.parts[lastElement])) {
            console.log("Warning: A duplicate quantifier may have been added " +
            "to the pattern. Check that you are not chaining quantifier methods.");
        }
    }
}

class RegexBackReferenceBuilder extends RegexBuilderBase {
    ref(n: number): this {
        this.pattern.parts.push(`\\${n}`);
        return this;
    }
}

class NestedGroupBuilder extends RegexBuilderBase {
    changeNestState(num: number, chars: string) {
        this.nests += num;
        this.pattern.parts.push(chars);
    }

    nest(): this {
        this.changeNestState(1, '(');
        return this;
    }

    unnest(n?: number | undefined): this {
        if (!n || n == 0) {
            this.changeNestState(-1, ')');
            return this;
        }
        for (let i = 0; i < n; i++) {
            this.changeNestState(-1, ')');
        }
        return this;
    }

    nestAdd(part: string, type: groupCode = 'cg'): this {
        let grouptype = processGroupCode(type);
        this.changeNestState(1, grouptype);
        this.pattern.parts.push(part);
        return this;
    }

    nestNonCapture(): this {
        this.changeNestState(1, '(?:');
        return this;
    }

    nestLookahead(): this {
        this.changeNestState(1, '(?=');
        return this;
    }

    nestLookbehind(): this {
        this.changeNestState(1, '(?<=');
        return this;
    }

    nestNegatedLA(): this {
        this.changeNestState(1, '(?!');
        return this;
    }

    nestNegatedLB(): this {
        this.changeNestState(1, '(?<!');
        return this;
    }

    nestNamed(name: string, content: string): this {
        this.changeNestState(1, `(?<${name}>${content}`);
        return this;
    }
}

class RegexBuilder {
    public nests = 0;
    public pattern: Regex = new Regex();
}

interface RegexBuilder extends FlagsBuilder,
    PatternPartBuilder,
    PatternGroupBuilder,
    PatternAssertionBuilder,
    PatternAlternationBuilder,
    RegexClassBuilder,
    RegexQuantifierBuilder,
    RegexBackReferenceBuilder,
    NestedGroupBuilder {}

applyMixins(RegexBuilder, [
    RegexBuilderBase, 
    FlagsBuilder, 
    PatternPartBuilder,
    PatternGroupBuilder,
    PatternAssertionBuilder,
    PatternAlternationBuilder,
    RegexClassBuilder,
    RegexQuantifierBuilder,
    RegexBackReferenceBuilder,
    NestedGroupBuilder ]);

export { Regex, RegexBuilder }