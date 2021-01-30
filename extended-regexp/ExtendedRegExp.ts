import { TemplateGroupHandler } from "../template-group-handler/TemplateGroupHandler.ts";

interface RegExpMatchMap {
    full_match: string,
    [key: string]: string
}

/**
 * Decorated JavaScript RegExp with additional methods and properties.
 * @param pattern - a regular expression
 * @param _template - a string template describing a regular expression structure
 */
export class ExtendedRegExp {
    constructor(private pattern: RegExp, private _template: string) { }

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

    exec(string: string): RegExpMatchArray | null {
        return this.pattern.exec(string);
    }

    test(string: string): boolean {
        return this.pattern.test(string);
    }

    match(string: string): RegExpMatchArray | null {
        return string.match(this.pattern);
    }

    matchAll(string: string): IterableIterator<RegExpMatchArray> {
        return string.matchAll(this.pattern);
    }

    replace(string: string, replaceValue: string): string {
        return string.replace(this.pattern, replaceValue);
    }

    search(string: string): number {
        return string.search(this.pattern);
    }

    split(string: string, limit: number | undefined): string[] {
        return string.split(this.pattern, limit);
    }

    // -----extra methods-----

    template(): string {
        return this._template;
    }

    /**
     * @experimental
     * Performs String.match(RegExp) but maps the matches to an object with the 
     * pattern's template capturing groups as keys.
     * @method
     * @name matchMap
     * @param {string} string
     * @returns {RegExpMatchMap} map of matches
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
     * 
     * For example, when given RegExpMatchArray ['hello world' 'world'] with template 'greeting (region)', the result is
     * { full_match: 'hello world', region: 'world'}.
     * @param matches - An array of regular expression matches.
     */
    map(matches: RegExpMatchArray): RegExpMatchMap {
        const map: RegExpMatchMap = { full_match: matches[0] };
        const groupNames = new TemplateGroupHandler(this._template).handleBrackets();
        for(let [i, name] of groupNames.entries()) {
            map[name] = matches[i + 1];
        }
        return map;
    }
}
