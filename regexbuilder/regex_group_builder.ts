import { stringOrRegExp } from "../utils/string_or_regexp.ts";
import { groupCode, groupStarters, processGroupCode } from "./process_group_code.ts";
import { RegexBuilderBase } from "./regex_builder_base.ts";

export class RegexGroupBuilder extends RegexBuilderBase {
    /** Adds a capturing group with content to the end of a regular expression. */
    capture(cg: string | RegExp): this {
        this.regex.parts.push(groupStarters.cg, stringOrRegExp(cg), groupStarters.close);
        return this;
    }
    /** Adds a non-capturing group with content to the end of a regular expression. */
    noncapture(ncg: string | RegExp): this {
        this.regex.parts.push(groupStarters.ncg, stringOrRegExp(ncg), groupStarters.close);
        return this;
    }
    /** Adds a named capturing group with content to the end of a regular expression. */
    namedCapture(name: string, content: string | RegExp): this {
        this.regex.parts.push('(?<', name, '>', stringOrRegExp(content), groupStarters.close);
        return this;
    }
    /** Adds a group with content to the end of a regular expression. */
    group(content: string | RegExp, groupCode: groupCode) {
        const grouptype = processGroupCode(groupCode);
        this.regex.parts.push(grouptype, stringOrRegExp(content), groupStarters.close);
        return this;
    }
}