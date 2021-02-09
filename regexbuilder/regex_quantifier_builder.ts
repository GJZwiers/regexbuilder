import { RegexBuilderBase } from "./regex_builder_base.ts";

export class RegexQuantifierBuilder extends RegexBuilderBase {
    /** Adds an N quantifier {n}. */
    times(n: number): this {
        this.checkDouble();
        this.regex.parts.push(`{${n}}`);
        return this;
    } 
    /** Adds an N to M range quantifier {n,m}. */
    between(n: number, m: number): this {
        this.checkDouble();
        this.regex.parts.push(`{${n},${m}}`);
        return this;
    }
    /** Adds an N or more quantifier {n,}. */
    atleast(n: number): this {
        this.checkDouble();
        this.regex.parts.push(`{${n},}`);
        return this;
    }
    /** Adds a one or more quantifier `+`. */
    onePlus(): this {
        this.checkDouble();
        this.regex.parts.push('+');
        return this;
    }
    /** Adds a zero or more quantifier `*`. */
    zeroPlus(): this {
        this.checkDouble();
        this.regex.parts.push('*');
        return this;
    }
    /** Adds a zero or one quantifier `?`. */
    oneZero(): this {
        this.checkDouble();
        this.regex.parts.push('?');
        return this;
    }
    /**
     * Makes the previous quantifier lazy, meaning it will stop on the first match it finds in a string.
     * 
     * Example: In the string `'barbarbar'` the regex `(bar)+` will match `'barbarbar'` but` (bar)+? `will match `'bar'`
     */
    lazy(): this {
        this.checkModifier();
        this.regex.parts.push('?');
        return this;
    }

    private checkModifier() {
        const previousToken = this.getPreviousToken();
        if (!/\{\d ?, ?\d\}|\{\d\}|\*|\+/.test(this.regex.parts[this.regex.parts.length - 1])) {
            console.warn(`(regexbuilder) PlacementWarning: lazy modifier "?" was placed after "${previousToken}" which is not a quantifier. ` +
            'This will behave as a "one or zero" quantifier instead of a lazy modifier. ' +
            'If this is what you intend consider using the "oneZero()" method instead.');
        }
    }

    private checkDouble() {
        const previousToken = this.getPreviousToken();
        if (/\{\d\}|\{\d,\s?\d\}$/.test(previousToken)) {
            console.warn('(regexbuilder) PlacementWarning: A duplicate quantifier may have been added ' +
            'to the regex. Check that you are not chaining quantifier methods.');
        }
    }

    private getPreviousToken() {
        return this.regex.parts[this.regex.parts.length - 1];
    }
}