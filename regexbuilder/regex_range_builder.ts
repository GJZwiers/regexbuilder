import { stringOrRegExp } from "../utils/string_or_regexp.ts";
import { RegexBuilderBase } from "./regex_builder_base.ts";

export class RegexRangeBuilder extends RegexBuilderBase {
    /** @deprecated, please use `.range()` instead. */
    class(content: string | RegExp): this {
       this.regex.parts.push('[', stringOrRegExp(content), ']'); 
       return this;
    }
    /** @deprecated, please use `.negatedRange()` instead. */
    negatedClass(content: string | RegExp): this {
        this.regex.parts.push('[^', stringOrRegExp(content), ']'); 
        return this;
    }
    /** Adds a character range `[content]` to the regex with the provided string content.*/
    range(content: string | RegExp): this {
        this.regex.parts.push('[', stringOrRegExp(content), ']'); 
        return this;
        }
    /** Adds a negated character range `[^content]` to the regex with the provided string content. */
    negatedRange(content: string | RegExp): this {
        this.regex.parts.push('[^', stringOrRegExp(content), ']'); 
        return this;
    }
}