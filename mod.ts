import { Regex } from './regexbuilder/Regex.ts';
import { Pattern } from './patternbuilder/Pattern.ts';
export { Regex }
export { Pattern }
export * from './extended-regexp/ExtendedRegExp.ts';

function main() {
    let pattern = Pattern.new()
        .data({
            foo: 'foo',
            bar: 'bar',
            baz: 'baz',
            woo: 'woo',
            loo: 'loo'
        })
        .settings({
            template: '(?:foo(bar))((woo)baz)'
        })
        .build();

    let matches = pattern[0].matchMap('foobarwoobaz');
}
main();