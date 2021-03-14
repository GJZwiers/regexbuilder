import { TemplateBracketHandler, TemplateStringHandler } from "../template-group-handler/template_string_handler.ts";

export interface RegExpMatchMap {
    full_match: string,
    [key: string]: string
}

/** Decorated JavaScript RegExp with additional methods and properties. */
export class ExtendedRegExp {
    constructor(private readonly pattern: RegExp, private readonly template: string) {}

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
    /** Throughput method for RegExp.exec. */
    exec(string: string): RegExpMatchArray | null {
        return this.pattern.exec(string);
    }
    /** Throughput method for RegExp.test. */
    test(string: string): boolean {
        return this.pattern.test(string);
    }
    /** Throughput method for String.match.  */
    match(string: string): RegExpMatchArray | null {
        return string.match(this.pattern);
    }
    /** Throughput method for String.matchAll. */
    matchAll(string: string): IterableIterator<RegExpMatchArray> {
        return string.matchAll(this.pattern);
    }
    /** Throughput method for String.replace. */
    replace(string: string, replaceValue: string): string {
        return string.replace(this.pattern, replaceValue);
    }
    /** Throughput method for String.search. */
    search(string: string): number {
        return string.search(this.pattern);
    }
    /** Throughput method for String.split. */
    split(string: string, limit?: number | undefined): string[] {
        return string.split(this.pattern, limit);
    }

    // -----Extended part-----

    /** Returns the template string for this pattern. */
    getTemplate(): string {
        return this.template;
    }
    /**
     * @experimental
     * Performs String.match(RegExp) but maps the matches to an object with the 
     * pattern's template capturing groups as keys.
     * 
     * For example, when given RegExpMatchArray  
     * `['hello world', 'world']` with template `'greeting (region)'`,  
     *  the result will be  
     *  `{ full_match: 'hello world', region: 'world' }`.
     */
    matchMap(string: string): RegExpMatchMap | null {
        const matches = string.match(this.pattern);
        if (!matches) return null;
        return this.map(matches);
    }
    /**
     * @experimental
     * Maps an array of matches according to the template of the pattern.
     * Returns an object with a key for the full match and one for each capturing group in the template.
     * Called as part of `matchMap()`.
     */
    map(matches: RegExpMatchArray): RegExpMatchMap {
        const templateVarNames = new TemplateBracketHandler(this.template, '(').handleBrackets();
        const map: RegExpMatchMap = { full_match: matches[0] };
        if (/\bfilter\b/.test(this.template)) {
            throw new Error(`(regexbuilder) TemplateMappingError: Cannot map unnamed capturing group added with \"filter()\". 
            Please use the indexes of the matches array instead when using a filter.`);
        }
        for (let [i, name] of templateVarNames.entries()) {
            map[name] = matches[i + 1];
        }
        return map;
    }

    static nests(str: string) {
        const results = new TemplateStringHandler(str, '(').extractTemplateGroups();
        console.log(results);
    }
}