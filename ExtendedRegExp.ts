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
        return this.pattern.exec(string)
    }

    test(string: string): boolean {
        return this.pattern.test(string)
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

    template(): string {
        return this._template;
    }
}
