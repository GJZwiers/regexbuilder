import { RegexBuilderBase } from "./regex_builder_base.ts";

const charClasses = {
    digit: '\\d',
    nonDigit: '\\D',
    word: '\\w',
    nonWord: '\\W',
    whitespace: '\\s',
    nonWhitespace: '\\S',
    tab: '\\t',
    carrReturn: '\\r',
    linefeed: '\\n',
    formfeed: '\\f',
    backspace: '[\\b]',
    nul: '\\0'
};

export class RegexCharacterClassBuilder extends RegexBuilderBase {  
    /** Adds `\d` to the regex. */
    digit(): this {
        this.regex.parts.push(charClasses.digit);
        return this;
    }
    /** Adds `\d` with a quantifier. */
    digits(n?: number, m?: |  number | '*'): this {
        this.handleCharClass(charClasses.digit, n, m);
        return this;
    }
    /** Adds `\D` to the regex. */
    nonDigit() {
        this.regex.parts.push(charClasses.nonDigit);
        return this;
    }
    /** Adds `\D` with a quantifier. */
    nonDigits(n?: number, m?: |  number | '*') {
        this.handleCharClass(charClasses.nonDigit, n, m);
        return this;
    }
    /** Adds `\w`. */
    word() {
        this.regex.parts.push(charClasses.word);
        return this;
    }
    /** Adds `\w` with a quantifier. */
    words(n?: number, m?: |  number | '*') {
        this.handleCharClass(charClasses.word, n, m);
        return this;
    }
    /** Adds `\W`. */
    nonWord() {
        this.regex.parts.push(charClasses.nonWord);
        return this;
    }
    /** Adds `\W` with a quantifier. */
    nonWords(n?: number, m?: |  number | '*') {
        this.handleCharClass(charClasses.nonWord, n, m);
        return this;
    }
    /** Adds `.` */
    any() {
        this.regex.parts.push('.');
		return this;
    }
    /** Adds `\s` */
    whitespace() {
        this.regex.parts.push(charClasses.whitespace);
		return this;
    }
    /** Adds `\s` with a quantifier. */
    whitespaces(n?: number, m?: |  number | '*') {
        this.handleCharClass(charClasses.whitespace, n, m);
		return this;
    }
    /** Adds `\S` */
    nonWhitespace() {
        this.regex.parts.push(charClasses.nonWhitespace);
		return this;
    }
    /** Adds `\S` with a quantifier. */
    nonWhitespaces(n?: number, m?: |  number | '*') {
        this.handleCharClass(charClasses.nonWhitespace, n, m);
		return this;
    }
    /** Adds `\t`. */
    tab() {
        this.regex.parts.push(charClasses.tab);
		return this;
    }
    /** Adds `\r`. */
    carriageReturn() {
        this.regex.parts.push(charClasses.carrReturn);
		return this;
    }
    /** Alias for carrReturn() */
    cr() {
        this.carriageReturn();
        return this;
    }
    /** Adds `\n`. */
    linefeed() {
        this.regex.parts.push(charClasses.linefeed);
		return this;
    }
    /** Alias for `linefeed()` */
    lf() {
        this.linefeed();
        return this;
    }
    /** Adds `\f`. */
    formfeed() {
        this.regex.parts.push(charClasses.formfeed);
		return this;
    }
    /** Adds `[\b]`. */
    backspace() {
        this.regex.parts.push(charClasses.backspace);
		return this;
    }
    /** Adds `\0`. */
    nul() {
        this.regex.parts.push(charClasses.nul);
		return this;
    }
    /** Adds `\cx`. */
    ctrlChar(x: string) {
        if (!/[A-Z]/.test(x)) {
            throw new Error(`(regexbuilder) Error: attempt to add invalid control character ${x}`);
        }
        this.regex.parts.push(`\\c${x}`);
		return this;
    }
    /** Adds `\xhh`. */
    hex(hh: string) {
        if (!/^[0-9A-F]{2}$/.test(hh)) {
            throw new Error("(regexbuilder) Error: attempt to add invalid hexadecimal characters");
        }
        this.regex.parts.push(`\\x${hh}`);
		return this;
    }
    /** Adds `\uhhhh`. */
    utf16(hhhh: string) {
        if (!/^[0-9A-F]{4}$/.test(hhhh)) {
            throw new Error("(regexbuilder) Error: attempt to add invalid hexadecimal characters");
        }
        this.regex.parts.push(`\\u${hhhh}`);
		return this;
    }
    /** Adds `\u{hhhh}` or `\u{hhhhh}`. */
    unicode(hhhh: string) {
        if (!/^[0-9A-F]{4,5}$/.test(hhhh)) {
            throw new Error("(regexbuilder) Error: attempt to add invalid hexadecimal characters");
        }
        this.regex.parts.push(`\\u\{${hhhh}\}`);
		return this;
    }

    private handleCharClass(charClass: string, n?: number, m?:  number | '*'): void {
        if (!n) this.regex.parts.push(charClass, `{1}`);
        else if (!m)
            this.regex.parts.push(charClass, `{${n.toString()}}`);
        else if (!Number.isInteger(n) )
            this.regex.parts.push(charClass, `{${Math.round(n).toString()}}`);
        else if (typeof m === 'number' && !Number.isInteger(m))
         this.regex.parts.push(charClass, `{${Math.round(m).toString()}}`);
        else if (m === '*')
            this.regex.parts.push(charClass, `{${n.toString()},}`);
        else
            this.regex.parts.push(charClass, `{${n.toString()},${m.toString()}}`);
    }
}