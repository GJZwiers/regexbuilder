import { Regex } from "./regex.ts";

export class RegexBuilderBase {
    regex: Regex = new Regex();
    nests = 0;
    /** Finishes construction of a regular expression using the builder and returns the regex built. */
    build(): RegExp {
        if (this.nests > 0) {
            throw new Error(`(regexbuilder) Error: Found unfinished nested structure in regex`);
        }
        return this.regex.compile();
    }
}