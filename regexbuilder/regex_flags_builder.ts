import { RegexBuilderBase } from "./regex_builder_base.ts";

export class RegexFlagsBuilder extends RegexBuilderBase {
    /** Adds flags to the regex, for example 'g', 'i', 'gi' or 'm'. */
    flags(flags: string): this {
        this.regex.flags += flags;
        return this;
    }
    /** Adds the 'g' flag to the regex. */
    global(): this {
        this.regex.flags += 'g';
        return this;
    }
    /** Adds the 'i' flag to the regex. */
    caseInsensitive(): this {
        this.regex.flags += 'i';
        return this;
    }
    /** Adds the 'm' flag to the regex. */
    multiline(): this {
        this.regex.flags += 'm';
        return this;
    }
    /** Adds the 'u' flag to the regex. */
    unicode(): this {
        this.regex.flags += 'u';
        return this;
    }
    /** Adds the 's' flag to the regex. */
    dotAll(): this {
        this.regex.flags += 's';
        return this;
    }
    /** Adds the 'y' flag to the regex. */
    sticky(): this {
        this.regex.flags += 'y';
        return this;
    }
}