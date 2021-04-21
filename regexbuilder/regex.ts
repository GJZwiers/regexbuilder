import { RegexBuilder } from "./regex_builder.ts";

export class Regex {
    readonly parts: Array<string> = [];
    flags: string = '';
    /** Starts construction of a regular expression through a fluent builder API by providing chainable methods. */
    static new(): RegexBuilder {
        return new RegexBuilder();
    }
    /** Joins the list of regex components together and compiles the resulting string to a RegExp with any flags that were provided. */
    compile(): RegExp {
        const regexString = this.parts.join('');
        this.analyze(regexString);
        return new RegExp(regexString, this.flags);
    }

    private analyze(regex: string) {
        const nulWithDigit = regex.match(/(?<!\\)\\0[0-9]/);
        if (nulWithDigit !== null) {
            console.warn(`(regexbuilder) Warning: found a digit character after a nul character class ${nulWithDigit}`);
        }
        const unicode = regex.match(/\\u\{[0-9A-Z]{4,5}\}/);
        if (unicode !== null && !/u/.test(this.flags)) {
            console.warn(`(regexbuilder) Warning: found a unicode character class ${unicode} while the unicode flag is not set`)
        }
    }
}