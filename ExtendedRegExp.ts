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

    map(matches: RegExpMatchArray) {
        let template = this._template;
        let map: any = {};
        map['full_match'] = matches[0];
        console.log(template);
        for (let i = 1; i < matches.length - 1; i++) {
            let group = template.match(/\(\?[<!][:=!]\w+(?=[()])|\(\?[:=!]\w+(?=[()])|(\w+(?=[()]))/);  // exclude|desired       
            if (!group) continue;
            template = template.replace(group[1], '');
            
            group[1] = group[1].replace(/[()]/g , '');
            console.log(`group: ${group} matches: ${matches[i + 1]}`);
            map[group[0]] = matches[i + 1];
        }
        
        return map;
    }
}
