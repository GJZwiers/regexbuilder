import { applyMixins } from '../utils/mixin.ts';
import { RegexNestBuilder } from "./regex_nest_builder.ts";
import { RegexAssertionBuilder } from "./regex_assertion_builder.ts";
import { RegexCharacterClassBuilder } from "./regex_character_class_builder.ts";
import { RegexQuantifierBuilder } from "./regex_quantifier_builder.ts";
import { RegexBuilderBase } from "./regex_builder_base.ts";
import { RegexAlternationBuilder } from "./regex_alternation_builder.ts";
import { RegexGroupBuilder } from "./regex_group_builder.ts";
import { RegexPartBuilder } from "./regex_part_builder.ts";
import { RegexRangeBuilder } from "./regex_range_builder.ts";
import { RegexFlagsBuilder } from "./regex_flags_builder.ts";
import { RegexBackReferenceBuilder } from "./regex_backreference_builder.ts";
import { Regex } from "./regex.ts";

export class RegexBuilder {
    regex: Regex = new Regex();
    nests = 0;
}

export interface RegexBuilder extends 
    RegexBuilderBase,
    RegexFlagsBuilder,
    RegexPartBuilder,
    RegexGroupBuilder,
    RegexAssertionBuilder,
    RegexAlternationBuilder,
    RegexRangeBuilder,
    RegexQuantifierBuilder,
    RegexBackReferenceBuilder,
    RegexCharacterClassBuilder,
    RegexNestBuilder {}

applyMixins(RegexBuilder, [
    RegexBuilderBase, 
    RegexFlagsBuilder, 
    RegexPartBuilder,
    RegexGroupBuilder,
    RegexAssertionBuilder,
    RegexAlternationBuilder,
    RegexRangeBuilder,
    RegexQuantifierBuilder,
    RegexBackReferenceBuilder,
    RegexCharacterClassBuilder,
    RegexNestBuilder]);
