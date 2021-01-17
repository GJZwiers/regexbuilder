
This module provides two fluent builder APIs to make regex patterns. One is used for piecewise building of a RegExp, while the other is used to create extended regexes from user-defined string templates.

## RegexBuilder
Start building with `Regex.new()`:
```typescript
import { Regex } from 'https://deno.land/x/regexbuilder/mod.ts';

Regex.new()
    .add('foo')
    .add('bar')
    .build();       >> /foobar/
```

```typescript
    .capture('foo');    >> /(foo)/
    .noncapture('bar');    >> /(?:bar)/
```

### Groups
There are two ways to add groups, either through its specific call or with `group`, providing one of the group codes followed by the content:
```typescript
    .lookahead('foo')
    // or
    .group('la', 'foo') //  codes are 'cg', 'ncg' ,'la', 'lb', 'nla', 'nlb'
    // both lead to
    >> /(?=foo)/
```

Named groups have to be made with `namedGroup`:
```typescript
.namedGroup('foo', 'bar');    >> /(?<foo>bar)/
```

### Nesting
A nested structure in the pattern can be started by calling `nest` for a capture group or specific calls to nest a different group. Call `unnest` to finish a nested tier, or provide it with an integer to finish multiple tiers at once:
```typescript
    Regex.new()
        .nest()
        .add('foo')
        .nestNonCapture()
        .add('bar')
        .unnest()   // or use .unnest(2)
        .unnest()
        .build()

        >> /(foo(?:bar))/
```
This can be shortened by using composite calls such as `nestAdd` to combine `nest` and `add` in once call. If no group type is provided it will default to a capturing group, in other cases you need to provide the group type as the second argument. To nest a named group, use `nestNamed`.
```typescript
    Regex.new()
        .nestAdd('foo')
        .nestAdd('bar', 'ncg')
        .unnest(2)
        .build()

        >> /(foo(?:bar))/
```


### Flags
Add flags at any point in the building process with `flags`:
```typescript
    .flags('g')
```

## PatternBuilder
is a methodology for building regexes according to templates and can be used to manage the complexity of handling lengthy patterns.

Start building with `Pattern.new`:
```typescript
import { Pattern } from 'https://deno.land/x/regexbuilder/mod.ts';

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

    >> /(hello|good morning|howdy) (?=world|new york|bar)/
```

### Templates
give a name to any arbitrary part of a pattern, whether they are inside a capture group or not. Any word in the template will be substituted with the values of the corresponding key in the data. Any array in the data will be joined with pipe `|` symbols to create alternates.
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
Declare a set of placeholder substitutes to reuse them in multiple patterns. Add placeholders to the data with double curly braces: `{{placeholder}}`
```typescript
const ph = {
    foo: ['bar', 'baz'],    // changes {{foo}} in any key in the data to bar|baz
};

Pattern.new()
    // .. settings, data
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
The pattern above will build to `/2018|2019|2020|(20\d{2}\b)/`. Any matched wildcard year will be placed in group 1.

