import { stringOrRegExp } from "../utils/string_or_regexp.ts";
import { groupStarters } from "./process_group_code.ts";
import { RegexBuilderBase } from "./regex_builder_base.ts";

export class RegexAssertionBuilder extends RegexBuilderBase {
    /** Adds a word boundary to the regex. */
    boundary() {
        this.regex.parts.push('\\b');
        return this;
    }
    /** Adds a word boundary to the regex. */
    negatedBoundary() {
        this.regex.parts.push('\\B');
        return this;
    }
    /** Adds the provided content to the regex within word boundaries `\bcontent\b` */
    bordered(content: string) {
        this.regex.parts.push(`\\b${content}\\b`);
        return this;
    }
    /** Adds a caret character, or start-of-the-line assertion, to the regex. */
    lineStart(): this {
        this.regex.parts.push('^');
        return this;
    }
    /** Adds a dollar character, or end-of-the-line assertion, to the regex. */
    lineEnd(): this {
        this.regex.parts.push('$');
        return this;
    }
    /** Combines RegexBuilder methods `lineStart()` and `add()`. */
    startsWith(start: string | RegExp): this {
        this.regex.parts.push('^', stringOrRegExp(start));
        return this;
    }
    /** Combines RegexBuilder methods add(...) and lineEnd(). */
    endsWith(end: string): this {
        this.regex.parts.push(end, '$');
        return this;
    }
    /** Adds a lookahead assertion to the regex. */
    lookahead(la: string | RegExp): this {
        this.regex.parts.push(groupStarters.la, stringOrRegExp(la), groupStarters.close);
        return this;
    }
    /** Adds a lookbehind assertion  to the regex. */
    lookbehind(lb: string | RegExp): this {
        this.regex.parts.push(groupStarters.lb, stringOrRegExp(lb), groupStarters.close);
        return this;
    }
    /** Adds a negated lookahead assertion  to the regex. */
    negatedLA(nla: string | RegExp): this {
        this.regex.parts.push(groupStarters.nla, stringOrRegExp(nla), groupStarters.close);
        return this;
    }
    /** Adds a negated lookbehind assertion to the regex. */
    negatedLB(nlb: string | RegExp): this {
        this.regex.parts.push(groupStarters.nlb, stringOrRegExp(nlb), groupStarters.close);
        return this;
    }
    /** Alias for `lookahead()`. */
    followedBy(la: string | RegExp): this {
        return this.lookahead(la);
    }
    /** Alias for `negatedLA()`. */
    notFollowedBy(nla: string | RegExp): this {
        return this.negatedLA(nla);
    }
    /** Alias for `lookbehind()`. */
    precededBy(lb: string | RegExp): this {
        return this.lookbehind(lb);
    }
    /** Alias for `negatedLB()`. */
    notPrecededBy(nlb: string | RegExp): this {
        return this.negatedLB(nlb);
    }
}