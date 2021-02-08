import { stringOrRegExp } from "../utils/string_or_regexp.ts";
import { RegexBuilderBase } from "./regex_builder_base.ts";
import { groupCode, groupStarters, processGroupCode } from "./process_group_code.ts";

export class RegexNestBuilder extends RegexBuilderBase {
    /** Starts the addition of a nested tier to the regex. */
    nest(): this {
        this.changeNestState(1, groupStarters.cg);
        return this;
    }
    /** Finishes a nested tier in the regex. An integer can be passed to complete multiple tiers at once or an asterisk to finish all remaining nests. */
    unnest(n?: undefined | number | '*'): this {
        if (!n || n === 0) {
            this.changeNestState(-1, groupStarters.close);
            return this;
        }
        if (n === '*') {
            this.changeNestState(-this.nests, groupStarters.close);
            return this;
        }
        this.changeNestState(-n, groupStarters.close);
        return this;
    }
    /** Combines methods `nest()` and `add()`. */
    nestAdd(part: string | RegExp, type: groupCode = 'cg'): this {
        let grouptype = processGroupCode(type);
        this.changeNestState(1, grouptype);
        this.regex.parts.push(stringOrRegExp(part));
        return this;
    }
    /** Combines methods `nest()` and `noncapture()`. */
    nestNonCapture(): this {
        this.changeNestState(1, groupStarters.ncg);
        return this;
    }
    /** Combines methods `nest()` and `lookahead()`. */
    nestLookahead(): this {
        this.changeNestState(1, groupStarters.la);
        return this;
    }
    /** Combines methods `nest()` and `lookbehind()`. */
    nestLookbehind(): this {
        this.changeNestState(1, groupStarters.lb);
        return this;
    }
    /** Combines methods `nest()` and `negatedLA()`. */
    nestNegatedLA(): this {
        this.changeNestState(1, groupStarters.nla);
        return this;
    }
    /** Combines methods `nest()` and `negatedLB ()`. */
    nestNegatedLB(): this {
        this.changeNestState(1, groupStarters.nlb);
        return this;
    }
    /** Combines methods `nest()` and `namedGroup()`. */
    nestNamed(name: string, content: string | RegExp): this {
        this.changeNestState(1, `(?<${name}>${stringOrRegExp(content)}`);
        return this;
    }

    private changeNestState(num: number, char: string) {
        for (let i = 0; i < Math.abs(num); i++) {
            this.regex.parts.push(char);
        }
        this.nests += num;
    }
}