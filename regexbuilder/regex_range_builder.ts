import { stringOrRegExp } from "../utils/string_or_regexp.ts";
import { RegexBuilderBase } from "./regex_builder_base.ts";

export class RegexRangeBuilder extends RegexBuilderBase {
    /** Adds a character class `[content]` to the regex with the provided string content.*/
    class(content: string | RegExp): this {
       this.regex.parts.push('[', stringOrRegExp(content), ']'); 
       return this;
    }
    /** Adds a negated character class `[^content]` to the regex with the provided string content. */
    negatedClass(content: string | RegExp): this {
        this.regex.parts.push('[^', stringOrRegExp(content), ']'); 
        return this;
    }
}