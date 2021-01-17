import { hasDuplicates } from "../utils/duplicates.ts";

/**
 * Decorated JavaScript RegExp with additional methods and properties.
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

    /**
     * Performs String.match(RegExp) but maps the matches to an object with the 
     * pattern's template capturing groups as the keys.
     * @method
     * @name matchMap
     * @param {string} string
     * @returns {RegExpMatchMap} - map of matches
     */
    matchMap(string: string) {
        let matches = string.match(this.pattern);
        if (!matches) return null;
        let map = this.map(matches);
        return map;
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

    template(): string {
        return this._template;
    }

    /**
     * @experimental
     * Maps an array of regular expression matches according to the pattern's template. 
     * Returns an object with a key for the full match and one for each capturing group in the template.
     * For example, when given RegExpMatchArray ['hello world' 'world'] with template 'greeting (region)', the result is
     * { full_match: 'hello world', region: 'world'}.
     * @param matches - An array of regular expression matches.
     */
    map(matches: RegExpMatchArray) {
        let template: string = this._template;
        let templateGroupPattern: RegExp = /\(\?[<!][:=!]\w+(?=[()])|\(\?[:=!]\w+(?=[()])|(((?<=\))\w+(?=\)))|\w+(?=[()]))/g;
        let groupNames: RegExpMatchArray[] = [...template.matchAll(templateGroupPattern)];
        console.log(groupNames);

        // swap elements
        for ( let i = 0; i < groupNames.length; i++) {
            if (groupNames[i][2]) {
                let previous = groupNames[i-1];
                groupNames[i-1] = groupNames[i];
                groupNames[i] = previous;
                console.log(groupNames);
            }
        }
        
        // get all the capturing groups
        let captureGroups: string[] = [];
        for (let groupName of groupNames) {
            let capturing = groupName[1];
            if (!capturing) continue;
            captureGroups.push(capturing);
        }
        if (hasDuplicates(captureGroups)) {
            throw new Error('Found duplicate names in the template string which cannot be properly mapped.')
        }
        let map: RegExpMatchMap = { full_match: matches[0] };
        let diff = matches.length - groupNames.length;
        let offset = 0;
        for (let i = 0; i < groupNames.length; i++) {
            let captureGroup = groupNames[i][1];
            if (!captureGroup) {
                offset += 1;
                continue;
            }
            map[captureGroup] = matches[i + 1 - offset];
        }
        console.log(map);
        
        return map;
    }
}

interface RegExpMatchMap {
    full_match: string,
    [key: string]: string
}