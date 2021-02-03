import { applyMixins } from '../utils/mixin.ts';
import { stringOrRegExp } from "../utils/stringOrRegExp.ts";

type groupCode = 'cg' | 'ncg' | 'la' | 'nla' | 'lb' | 'nlb';

const types = {
    cg: '(',
    ncg: '(?:',
    la: '(?=',
    lb: '(?<=',
    nla: '(?!',
    nlb: '(?<!'
};

function processGroupCode(type: groupCode): string {
    if (type === 'cg') {
        return types.cg;
    } else if (type === 'ncg') {
        return types.ncg;
    } else if (type === 'la') {
        return types.la;
    } else if (type === 'lb') {
        return types.lb;
    } else if (type === 'nla') {
        return types.nla;
    } else if (type === 'nlb') {
        return types.nlb;
    } else {
        throw new Error(`Invalid group code: ${type}`);
    }
}

class Regex {
    public readonly parts: Array<string> = [];
    public flags: string = '';

    /**
     * Starts construction of a regular expression through a fluent builder API 
     * by providing chainable methods. 
     */
    static new(): RegexBuilder {
        return new RegexBuilder();
    }
    /**
     * Joins the list of pattern components together and compiles the resulting 
     * string to a RegExp with any flags that were provided.
     */
    compile(): RegExp {
        return new RegExp(this.parts.join(''), this.flags);
    }
}

abstract class RegexBuilderBase {
    public pattern: Regex = new Regex();
    public nests = 0;

    /**
     * Finishes construction of a regular expression using the builder 
     * and returns the pattern built.
     */
    build(): RegExp {
        if (this.nests > 0) {
            throw new Error("(regexbuilder) Error: Found unfinished nested structure in pattern." + this.pattern.parts);
        }
        return this.pattern.compile();
    }
}

class FlagsBuilder extends RegexBuilderBase {
    /**
     * Adds regex flags to the pattern, for example 'g', 'i', 'gi' or 'm'.
     * @param flags 
     */
    flags(flags: string): this {
        this.pattern.flags = flags;
        return this;
    }
}

class PatternPartBuilder extends RegexBuilderBase {
    /**
     * Adds a part to the end of a regular expression. 
     * 
     * @param part 
     */
    add(part: string | RegExp): this {
        this.pattern.parts.push(stringOrRegExp(part));
        return this;
    }
}

class PatternGroupBuilder extends RegexBuilderBase {
    /**
     * Adds a capturing group with content to the end of a regular expression. 
     * 
     * @param cg 
     */
    capture(cg: string | RegExp): this {
        this.pattern.parts.push(types.cg, stringOrRegExp(cg), ')');
        return this;
    }
    /**
     * Adds a non-capturing group with content to the end of a regular expression. 
     * 
     * @param ncg 
     */
    noncapture(ncg: string | RegExp): this {
        this.pattern.parts.push(types.ncg, stringOrRegExp(ncg), ')');
        return this;
    }
    /**
     * Adds a group with content to the end of a regular expression. 
     * 
     * @param type
     * @param content 
     */
    group(type: groupCode, content: string | RegExp) {
        let grouptype = processGroupCode(type);
        this.pattern.parts.push(grouptype, stringOrRegExp(content), ')');
        return this;
    }
    /**
     * Adds a named capturing group with content to the end of a regular expression.
     * 
     * @param name
     * @param group 
     */
    namedGroup(name: string, group: string | RegExp): this {
        this.pattern.parts.push('(?<', name, '>', stringOrRegExp(group), ')');
        return this;
    }
}

class PatternAssertionBuilder extends RegexBuilderBase {
    /**
     * Adds a caret character, or start-of-the-line assertion, to the pattern.
     */
    lineStart(): this {
        this.pattern.parts.push('^');
        return this;
    }
    /**
     * Adds a dollar character, or end-of-the-line assertion, to the pattern.
     */
    lineEnd(): this {
        this.pattern.parts.push('$');
        return this;
    }
    /**
     * Combines RegexBuilder methods lineStart() and add(...).
     * @param start 
     */
    startsWith(start: string | RegExp): this {
        this.pattern.parts.push('^', stringOrRegExp(start));
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
    /**
     * Adds a lookahead assertion with the contents of argument `la` to the pattern.
     * @param la - The contents `x` of a lookahead expression `(?=x)`
     */
    lookahead(la: string | RegExp): this {
        this.pattern.parts.push(types.la, stringOrRegExp(la), ')');
        return this;
    }
    /**
     * Adds a lookbehind assertion with the contents of argument `lb` to the pattern.
     * @param lb  -  The contents `x` of a lookbehind expression `(?<=x)`
     */
    lookbehind(lb: string | RegExp): this {
        this.pattern.parts.push(types.lb, stringOrRegExp(lb), ')');
        return this;
    }
    /**
     * Adds a negated lookahead assertion with the contents of argument `nla` to the pattern.
     * @param nla  - The contents `x` of a lookahead expression `(?!x)`
     */
    negatedLA(nla: string | RegExp): this {
        this.pattern.parts.push(types.nla, stringOrRegExp(nla), ')');
        return this;
    }
    /**
     * Adds a negated lookbehind assertion with the contents of argument `nlb` to the pattern.
     * @param nlb  -  The contents `x` of a negated lookbehind expression `(?<!x)`
     */
    negatedLB(nlb: string | RegExp): this {
        this.pattern.parts.push(types.nlb, stringOrRegExp(nlb), ')');
        return this;
    }
    /**
     * Alias for `lookahead()`.
     * @param la - The contents `x` of a lookahead expression `(?=x)`
     */
    followedBy(la: string | RegExp): this {
        return this.lookahead(la);
    }
    /**
     * Alias for `negatedLA()`.
     * @param nla  - The contents `x` of a lookahead expression `(?!x)`
     */
    notFollowedBy(nla: string | RegExp): this {
        return this.negatedLA(nla);
    }
    /**
     * Alias for `lookbehind()`.
     * @param lb  -  The contents `x` of a lookbehind expression `(?<=x)`
     */
    precededBy(lb: string | RegExp): this {
        return this.lookbehind(lb);
    }
    /**
     * Alias for `negatedLB()`.
     * @param nlb  -  The contents `x` of a negated lookbehind expression `(?<!x)`
     */
    notPrecededBy(nlb: string | RegExp): this {
        return this.negatedLB(nlb);
    }
}

class PatternAlternationBuilder extends RegexBuilderBase {
    /**
     * Joins a list of strings as alternates to the end of a regular expression. 
     * @param alts - A list of strings or regex literals
     */
    alts(alts: string[] | RegExp[]): this {
        alts.forEach((item: string | RegExp, index: number, arr: string[] | RegExp[]) => {
            if (item instanceof RegExp) {
                arr[index] = item.source;
            }
        });
        this.pattern.parts.push(alts.join('|'));
        return this;
    }
    /**
     * Joins a list of strings to regex alternates wrapped in a certain regex group type and adds it 
     * to the pattern.
     * @param alts - The list of strings to join
     * @param code - The type of group to wrap the values in: `"cg" | "ncg" | "la" | "lb" | "nla" | "nlb"`
     */
    altGroup(alts: string[], code: groupCode): this {
        let grouptype = processGroupCode(code);
        this.pattern.parts.push(grouptype, alts.join('|'), ')')
        return this;
    }

    joinGroup(vals: string[], code: groupCode, separator: string): this {
        let grouptype = processGroupCode(code);
        this.pattern.parts.push(grouptype, vals.join(separator), ')');
        return this;
    }

    joinWith(vals: string[], separator: string): this {
        this.pattern.parts.push(vals.join(separator));
        return this;
    }
}

class RegexClassBuilder extends RegexBuilderBase {
    /**
     * Adds a character class to the pattern with the string content provided.
     * @param content 
     */
    class(content: string | RegExp): this {
       this.pattern.parts.push('[', stringOrRegExp(content), ']'); 
       return this;
    }
    /**
     * Adds a negated character class to the pattern with the string content provided.
     * @param content 
     */
    negatedClass(content: string | RegExp): this {
        this.pattern.parts.push('[^', stringOrRegExp(content), ']'); 
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
     /**
     * Adds a one or more quantifier `+`.
     */
    onePlus(): this {
        this.checkDouble();
        this.pattern.parts.push('+');
        return this;
    }
    /**
     * Adds a zero or more quantifier `*`.
     */
    zeroPlus(): this {
        this.checkDouble();
        this.pattern.parts.push('*');
        return this;
    }
    /**
     * Adds a zero or one quantifier `?`.
     */
    oneZero(): this {
        this.checkDouble();
        this.pattern.parts.push('?');
        return this;
    }
    /**
     * Makes the previous quantifier lazy, meaning it will stop on the first match it finds in a string.
     * 
     * Example: In the string `'barbarbar'` the pattern `(bar)+` will match `'barbarbar'` but` (bar)+? `will match `'bar'`
     */
    lazy(): this {
        this.checkModifier();
        this.pattern.parts.push('?');
        return this;
    }

    private checkModifier() {
        const previousToken = this.getPreviousToken();
        if (!/\{\d ?, ?\d\}|\{\d\}|\*|\+/.test(this.pattern.parts[this.pattern.parts.length - 1])) {
            console.warn(`(regexbuilder) Warning: lazy modifier "?" was placed after "${previousToken}" which is not a quantifier. ` +
            'This will behave as a "one or zero" quantifier instead of a lazy modifier. ' +
            'If this is what you intend consider using the "oneZero()" method instead.');
        }
    }

    private checkDouble() {
        const previousToken = this.getPreviousToken();
        if (/\{\d\}|\{\d,\s?\d\}$/.test(previousToken)) {
            console.warn('(regexbuilder) Warning: A duplicate quantifier may have been added ' +
            'to the pattern. Make sure that you are not chaining quantifier methods.');
        }
    }

    private getPreviousToken() {
        return this.pattern.parts[this.pattern.parts.length - 1]
    }
}

class RegexBackReferenceBuilder extends RegexBuilderBase {
    /**
     * Adds a backreference to a capturing group to the pattern.
     * @param n - The number of the capturing group to be referenced
     */
    ref(n: number): this {
        this.pattern.parts.push(`\\${n}`);
        return this;
    }
}

class NestedGroupBuilder extends RegexBuilderBase {
    /**
     * Starts addition of a nested tier to the pattern.
     */
    nest(): this {
        this.changeNestState(1, '(');
        return this;
    }
    /**
     * Finishes a nested tier in the pattern. An integer can be passed to complete multiple tiers at once, 
     * or an asterisk to finish all remaining nests.
     * @param n 
     */
    unnest(n?: undefined | number | '*'): this {
        if (!n || n === 0) {
            this.changeNestState(-1, ')');
            return this;
        }
        if (n === '*') {
            this.changeNestState(-this.nests, ')');
            return this;
        }
        this.changeNestState(-n, ')');
        return this;
    }

    nestAdd(part: string | RegExp, type: groupCode = 'cg'): this {
        let grouptype = processGroupCode(type);
        this.changeNestState(1, grouptype);
        this.pattern.parts.push(stringOrRegExp(part));
        return this;
    }

    nestNonCapture(): this {
        this.changeNestState(1, types.ncg);
        return this;
    }

    nestLookahead(): this {
        this.changeNestState(1, types.la);
        return this;
    }

    nestLookbehind(): this {
        this.changeNestState(1, types.lb);
        return this;
    }

    nestNegatedLA(): this {
        this.changeNestState(1, types.nla);
        return this;
    }

    nestNegatedLB(): this {
        this.changeNestState(1, types.nlb);
        return this;
    }

    nestNamed(name: string, content: string | RegExp): this {
        this.changeNestState(1, `(?<${name}>${stringOrRegExp(content)}`);
        return this;
    }

    private changeNestState(num: number, char: string) {
        for (let i = 0; i < Math.abs(num); i++) {
            this.pattern.parts.push(char);
        }
        this.nests += num;
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
