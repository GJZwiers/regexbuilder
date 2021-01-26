import { Regex } from './regexbuilder/Regex.ts';
import { Pattern } from './patternbuilder/Pattern.ts';
export { Regex }
export { Pattern }
export * from './extended-regexp/ExtendedRegExp.ts';

function main() {
    let re = Regex.new()
        .alts([/foo/, /bar/, /baz/])
        .namedGroup('bla', /woo/)
        .build()
    console.log(re);
}

main();