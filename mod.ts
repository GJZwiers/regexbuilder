export { Regex } from './regexbuilder/Regex.ts';
import { Pattern } from './patternbuilder/Pattern.ts';
export * from './extended-regexp/ExtendedRegExp.ts';

function main() {
    let pattern = Pattern.new()
        .settings({ template: 'years'})
        .data({ years: String.raw`20\d{2}` })
        .filter("2000")
        .build();
    console.log(pattern)

    console.log(pattern[0].match('2001'));
}
main();
