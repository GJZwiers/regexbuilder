import { RegexBuilderBase } from "./regex_builder_base.ts";

export class RegexFlagsBuilder extends RegexBuilderBase {
    /** Adds regex flags to the regex, for example 'g', 'i', 'gi' or 'm'. */
    flags(flags: string): this {
        this.regex.flags = flags;
        return this;
    }
}