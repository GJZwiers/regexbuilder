import { TemplateBracketHandler } from "../template-group-handler/TemplateStringHandler.ts";

interface RegExpMatchMap {
    full_match: string,
    [key: string]: string
}

/**
 * Decorated JavaScript RegExp with additional methods and properties.
 * @param pattern - a regular expression.
 * @param template - a string template describing a regular expression structure.
 * @param automap - boolean flag that sets whether or not the pattern automatically maps arrays of matches.
 */
export class ExtendedRegExp {
    constructor(private readonly pattern: RegExp,
                private readonly template: string,
                private readonly automap: boolean) { }

    get dotAll(): boolean {
        return this.pattern.dotAll;
    }

    get flags(): string {
        return this.pattern.flags;
    }

    get global(): boolean {
        return this.pattern.global;
    }

    get ignoreCase(): boolean {
        return this.pattern.ignoreCase;
    }

    get lastIndex(): number {
        return this.pattern.lastIndex;
    }

    set lastIndex(value: number) {
        this.pattern.lastIndex = value;
    }

    get multiline(): boolean {
        return this.pattern.multiline;
    }

    get source(): string {
        return this.pattern.source;
    }

    get sticky(): boolean {
        return this.pattern.sticky;
    }

    get unicode(): boolean {
        return this.pattern.unicode;
    }
    /**
     * Throughput method for RegExp.exec.
     * @param string 
     */
    exec(string: string): RegExpMatchArray | null {
        return this.pattern.exec(string);
    }
    /**
     * Throughput method for RegExp.test.
     * @param string 
     */
    test(string: string): boolean {
        return this.pattern.test(string);
    }
    /**
     * Throughput method for String.match.
     * @param string 
     */
    match(string: string): RegExpMatchArray | RegExpMatchMap | null {
        if (this.automap) {
            return this.matchMap(string);
        }
        return string.match(this.pattern);
    }
    /**
     * Throughput method for String.matchAll.
     * @param string 
     */
    matchAll(string: string): IterableIterator<RegExpMatchArray> {
        return string.matchAll(this.pattern);
    }
    /**
     * Throughput method for String.replace.
     * @param string 
     * @param replaceValue
     */
    replace(string: string, replaceValue: string): string {
        return string.replace(this.pattern, replaceValue);
    }
    /**
     * Throughput method for String.search.
     * @param string 
     */
    search(string: string): number {
        return string.search(this.pattern);
    }
    /**
     * Throughput method for String.split.
     * @param string 
     * @param limit
     */
    split(string: string, limit: number | undefined): string[] {
        return string.split(this.pattern, limit);
    }

    // -----Additional methods-----

    /**
     * Returns the template string for this pattern.
     */
    getTemplate(): string {
        if (Array.isArray(this.template)) {
            return this.template.join(' --- ');
        }
        return this.template;
    }
    /**
     * @experimental
     * Performs String.match(RegExp) but maps the matches to an object with the 
     * pattern's template capturing groups as keys.
     * 
     * For example, when given RegExpMatchArray `['hello world', 'world']` with template `'greeting (region)'`,
     *  the result will be `{ full_match: 'hello world', region: 'world'}`.
     * @param {string} string
     */
    matchMap(string: string): RegExpMatchMap | null {
        let matches = string.match(this.pattern);
        if (!matches) return null;
        return this.map(matches);
    }
    /**
     * @experimental
     * Maps an array of matches according to the template of the pattern.
     * Returns an object with a key for the full match and one for each capturing group in the template.
     * Used implicitly in `matchMap()`
     * @param matches - An array of regular expression matches.
     */
    map(matches: RegExpMatchArray): RegExpMatchMap {
        const map: RegExpMatchMap = { full_match: matches[0] };
        const groupNames = new TemplateBracketHandler(this.template, '(').handleBrackets();
        for (let [i, name] of groupNames.entries()) {
            map[name] = matches[i + 1];
        }
        return map;
    }
}
