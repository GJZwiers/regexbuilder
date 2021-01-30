![build](https://github.com/GJZwiers/regexbuilder-deno/workflows/Build/badge.svg)

This module provides two fluent builder APIs to make regex patterns. One is used for piecewise building of a RegExp, while the other is used to create extended regexes from user-defined string templates.

# Table of Contents
- [RegexBuilder](#regexbuilder)  
   * [Groups](#groups)  
   * [Nesting](#nesting)  
   * [Assertions](#assertions)  
   * [Alternation](#alternation)  
   * [Quantifiers](#quantifiers)  
   * [Backreferences](#backreferences)  
   * [Flags](#flags)  
- [PatternBuilder](#patternbuilder)  
   * [Templates](#templates)  
   * [Placeholders](#placeholders)  
   * [Exceptions](#exceptions)  
   * [Wildcard Pattern](#wildcard-pattern)  
   * [Match Maps](#match-maps)

---

## RegexBuilder
Start building with `Regex.new()`:
```typescript
import { Regex } from 'https://deno.land/x/regexbuilder/mod.ts';

Regex.new()
    .add('foo')
    .add('bar')
    .build();       
    
    >> /foobar/
```

Adding regex literals together is also supported:
```typescript
    .add(/foo/)
    .add(/bar/)
    .build();       
    
    >> /foobar/
```

### Groups
To add groups either use the specific method call or use the more general `group` method where you provide the content and the group type:
```typescript
    .capture('foo');    >> /(foo)/
```
```typescript
    .noncapture('bar');    >> /(?:bar)/
```

```typescript
    .group('bar', 'ncg')    >> /(?:bar)/
```

Named groups should be made with `namedGroup`:
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

### Assertions
```typescript
    .lineStart()
    .add('foo')
    .lineEnd()  
    
    >> /^foo$/
```
```typescript
    .startsWith('foo')  >> /^foo/
```
```typescript
    .endsWith('bar')    >> /bar$/
```

```typescript
    .add('foo')
    .lookahead('bar')
    // or
    .followedBy('bar')

    >> /foo(?=bar)/
```

### Alternation
```typescript
    .alts(['foo','bar','baz']);
    >> /foo|bar|baz/

    .altGroup(['foo', 'bar', 'baz'], 'ncg')
    >> /(?:foo|bar|baz)/

    .joinGroup(['foo','bar','baz'], 'la', '.');
    >> /(?=foo.bar.baz)/
```

### Quantifiers
```typescript
    .add('foo')
    .times(2)
    >> /foo{2}/ // matches fo with 2 more o's

    .between(2, 5)
    >> /foo{2,5}/   // matches fo with 2 to 5 more o's

    .atleast(2)
    >> /foo{2,}/    // matches fo with 2 or more o's

    .zeroPlus()
    >> /foo*/   // matches fo with 0 or more o's

    .onePlus()
    >> /foo+/   // matches fo with 1 or more o's
```

### Backreferences
```typescript
    .capture('foo')
    .add('[: ]+')
    .ref(1)

    >> /(foo)[: ]+\1/
```

### Flags
```typescript
    .add('foo')
    .flags('g')
    >> /foo/g
```

---

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
        greetings: ['hello', 'good morning', 'howdy'],
        regions: ['world', 'new york', '{{foo}}']
    })
    .placeholders({ foo: ['bar'] })
    .build();

    >> /(hello|good morning|howdy) (?=world|new york|bar)/i
```

### Templates
Give a name to any arbitrary part of a pattern, whether they are inside a capture group or not. Any word in the template will be substituted with the values of the corresponding key in the data. Any array in the data will be joined with pipe `|` symbols to create alternates.
```typescript
    .settings({
        template: 'field_names[: ]+(field_values)'
    })
    .data({
        field_names: ['Product Volume', 'volume']
        field_values: ['100ml', '5L', String.raw`\d{1,4}[cml]`]
    })
```
Multiple templates are supported as well:
```typescript
    .settings({
        template: [
            'day-month-year',
            'month-day-year'
        ]
    })
    .data({
        day: '[0-3][0-9]',
        month: ['jan', 'feb', 'mar', ..., 'dec'],
        year: String.raw`(?:19|20)\d{2}\b`
    })
```


### Placeholders
Declare a set of placeholder substitutes to reuse them in multiple patterns. Add placeholders to the data with double curly braces: `{{placeholder}}`
```typescript
const ph = {
    foo: ['bar', 'baz'],    // changes '{{foo}}' in any key in the data to 'bar|baz'
};

Pattern.new()
    .placeholders(ph)
```

### Filter Exceptions
Separate desired and unwanted values with the `filter` method. Note that this will restructure your template as `exclude|({the-rest-of-the-template})` and _place any desired full match in capture group 1_ while adding unwanted values to group 0 only.
```typescript
    .settings({ template: 'years'})
    .data({ years: String.raw`20\d{2}` })
    .filter("2000")
```
The pattern above will build to `/2000|(20\d{2})/`. If it matches `2000` the result will not have an index 1, but it will if if matches anything else like `2001`.

### Wildcard Pattern
Add a wildcard to be searched for after a set of known values. Note that this will restructure your template as `{the-rest-of-the-template}|(wildcard)`, adding a capture group but not changing the order of existing ones.
```typescript
    .settings({ template: 'years'})
    .data({ years: ['2018', '2019', '2020'] })
    .wildcard(String.raw`20\d{2}\b`)
```
The pattern above will build to `/2018|2019|2020|(20\d{2}\b)/`. Any matched wildcard year will be placed in group 1.

### Match Maps
Match results can be mapped to their pattern's template with the `matchMap` method:
```typescript
    .settings({ template: '(greeting) (region)' })
    .data({ greeting: 'hello', region: 'world' })
    .build()

    >> /(hello) (world)/

pattern.matchMap('hello world')

>> { full_match: 'hello world', greeting: 'hello', region: 'world' }
```
