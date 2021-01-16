
This module provides two fluent builder APIs to make regex patterns. One is used for piecewise building of a RegExp, while the other is used to create extended regexes from user-defined string templates.

## RegexBuilder
```typescript
import { RegexBuilder } from 'https://deno.land/x/regexbuilder@0.1.1/mod.ts';

Regex.new().part('foo').part('bar');     >> /foobar/
```


```typescript
Regex.new().capture('foo');    >> /(foo)/
Regex.new().noncapture('bar');    >> /(?:bar)/
```
Alternatively, you can use the more general `group` method to add groups.
```typescript
Regex.new().group('cg', 'foo');    >> /(foo)/
```

It is also possible to add named groups:
```typescript
Regex.new().namedGroup('foo', 'bar');    >> /(?<foo>bar)/
```



## PatternBuilder
provides a methodology for building regexes according to templates and can be used to manage the complexity of handling lengthy patterns.

```typescript
import { PatternBuilder } from 'https://deno.land/x/regexbuilder@0.1.1/mod.ts';

let pattern = Pattern.new()
    .settings({
        template: '(greetings) (?=regions)',
        flags: 'i'
    })
    .data({
        greetings: [ 'hello', 'good morning', 'howdy' ],
        regions: [ 'world', 'new york', '{{foo}}' ]
    })
    .placeholders({ foo: ['bar'] })
    .build();
```

### Templates
Give a name to any arbitrary part of a pattern, whether they are inside a capture group or not. Any word in the template will be substituted with the values of the corresponding key in the data. Any array in the data will be joined with pipe `|` symbols to create alternates.
```typescript
.settings({
    template: 'field_names[: ]+(field_values)'
})
.data({
    field_names: ['Product Volume', 'volume']
    field_values: [ '100ml', '5L', '\\d{1,4}[cml]']
})
```

### Placeholders
Declare a set of placeholders to be reused in multiple patterns:
```typescript
const ph = {
    foo: ['bar', 'baz'],
};

Pattern.new()
    // ..
    .placeholders(ph)
```

### Exceptions
Exclude values you know you don't want in your match results. Note that this will restructure your template as `exclude|({the-rest-of-the-template})` and _place any desired full match in capture group 1_ while adding exclusions to group 0.
```typescript
Pattern.new()
    .settings({ template: 'years'})
    .data({ years: String.raw`20\d{2}` })
    .except(["2000"])
```
The pattern above will build to `/2000|(20\d{2})/`.

### Wildcards
Add a wildcard to be searched for after a set of known values. Note that this will restructure your template as `{the-rest-of-the-template}|(wildcard)`, adding a capture group but not changing the order of existing ones.
```typescript
Pattern.new()
    .settings({ template: 'years'})
    .data({ years: ['2018', '2019', '2020'] })
    .wildcard([String.raw`20\d{2}\b`])
```
The pattern above will build to `/2018|2019|2020|(20\d{2})/`. Any matched wildcard year will be placed in group 1.

