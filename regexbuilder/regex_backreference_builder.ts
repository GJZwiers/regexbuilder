import { RegexBuilderBase } from "./regex_builder_base.ts";

export class RegexBackReferenceBuilder extends RegexBuilderBase {
    /**
     * Adds a backreference to a capturing group to the regex.
     * @param n - The number of the capturing group to be referenced, or 
     * the name of the named capturing group to be referenced as a string
     */
    ref(n: number | string): this {
        if (typeof n === 'number') {
            this.regex.parts.push(`\\${n}`);
        } else {
            this.regex.parts.push(`\\k<${n}>`)
        }
        return this;
    }
}