import { Pattern } from './patternbuilder/Pattern.ts';
export { Pattern }
import { Regex } from './regexbuilder/Regex.ts';
export { Regex }
export * from './ExtendedRegExp.ts';

function main() {
    let re = Regex.new()
        .nestAdd('foo')
        .nestAdd('bar', 'ncg')
        .unnest(2)
        .build()

    console.log(re);
    
}
main();