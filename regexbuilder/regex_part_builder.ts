import { stringOrRegExp } from "../utils/string_or_regexp.ts";
import { RegexBuilderBase } from "./regex_builder_base.ts";

export class RegexPartBuilder extends RegexBuilderBase {
    /** Adds a part to the end of a regular expression. */
    add(part: string | RegExp): this {
        this.regex.parts.push(stringOrRegExp(part));
        return this;
    }
}