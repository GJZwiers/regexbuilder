import { stringOrRegExp } from "../utils/string_or_regexp.ts";
import { RegexBuilderBase } from "./regex_builder_base.ts";

export class RegexRangeBuilder extends RegexBuilderBase {
    /** Adds a character class to the regex with the string content provided.*/
    class(content: string | RegExp): this {
       this.regex.parts.push('[', stringOrRegExp(content), ']'); 
       return this;
    }
    /** Adds a negated character class to the regex with the string content provided. */
    negatedClass(content: string | RegExp): this {
        this.regex.parts.push('[^', stringOrRegExp(content), ']'); 
        return this;
    }
}