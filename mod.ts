import { Pattern } from './patternbuilder/Pattern.ts';
export { Pattern }
import { Regex } from './regexbuilder/Regex.ts';
export { Regex }
export * from './ExtendedRegExp.ts';

function main() {
    let pattern = Pattern.new()
        .data({
            foo: 'hello',
            bar: 'abcd',
            baz: 'zoom'
        })
        .settings({
            template: '(foo(bar))(baz)'
        })
        .except(['2000'])
        .wildcard('2\\d{3}')
        .build();

        console.log(pattern);
        
        let matches = pattern[0].matchMap('2002');
        console.log(matches);
}
main();