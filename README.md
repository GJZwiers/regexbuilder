![build](https://github.com/GJZwiers/regexbuilder-deno/workflows/Build/badge.svg)

This module provides two fluent builder interfaces to make regex patterns. RegexBuilder is used for piecewise building of a RegExp, while PatternBuilder is used to create extended regexes from string templates defined by the user.

# Table of Contents
- [RegexBuilder](#regexbuilder)  
   * [Groups](#groups)  
   * [Nesting](#nesting)  
   * [Assertions](#assertions)  
   * [Alternates](#alternation)  
   * [Quantifiers](#quantifiers)  
   * [Backreferences](#backreferences)  
   * [Flags](#flags)  
- [PatternBuilder](#patternbuilder)  
   * [Templates](#templates)  
   * [Placeholders](#placeholders)  
   * [Match Maps](#match-maps)
   * [Automatic Mapping](#automatic-mapping)
   * [Exceptions](#exceptions)  
   * [Wildcard Pattern](#wildcard-pattern)
   * [Custom Variable Symbol](#custom-variable-symbol)
   * [Custom Separator Symbol](#custom-separator) 

- [Customizing PatternBuilder](#customizing-patternbuilder)

   * [Custom Template-Building Specification (Experimental)](#custom-specification-to-build-templates-(experimental))

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
    .vars({
        greetings: ['hello','good morning','howdy'],
        regions: ['world','new york','{{foo}}']
    })
    .placeholders({ foo: 'bar' })
    .build();

    >> /(hello|good morning|howdy) (?=world|new york|bar)/i
```

### Templates
Templates are useful to separate concerns between a pattern's structure and values. You can name any part. 

Any word in the template will be substituted with the values of the corresponding key in the data. Arrays in the data will be joined to a sequence of alternates (or a custom sequence if you define a custom separator):
```typescript
    .settings({
        template: '(?:expiration_statement)[: ]+(day-month-year)'
    })
    .vars({
        expiration_statement: ['best-by','use-by','consume before','expiration date','expiry date'],
        day: '[0-3][0-9]',
        month: ['jan', 'feb', 'mar', ..., 'dec'],
        year: String.raw`(?:19|20)\d{2}\b`  // Note that you will need double backslashes with a normal string 
    })
```
If the data you wish to match will have various different shapes it's also possible to define multiple templates and use `buildAll()` in place of `build()`. This will return an array of patterns. For example, if you are matching both American and European date formats:
```typescript
    .settings({
        template: [
            'day-month-year',
            'month-day-year'
        ]
    })
    .vars({
        day: '[0-3][0-9]',
        month: ['jan', 'feb', 'mar', ..., 'dec'],
        year: String.raw`(?:19|20)\d{2}\b`
    })
    .buildAll();
```

Picking a [template variable symbol](#custom-variable-symbol) is possible if you want to be more clear on which parts of a template are variables and which are not.

When you don't need to use any settings and only want to define a template, you can also use `template` as a more concise route:
```typescript
Pattern.new()
    .template('(foo)(?!bar)')
    .vars({ foo: 'bar', bar: 'baz'})
    .build();
```

### Placeholders
Declare a set of placeholder substitutes to reuse them in multiple patterns. Add placeholders to the data with double curly braces and a name: `{{placeholder}}`.

The example below shows how to reuse some of the data from the two previous patterns by using placeholders for `day`, `month` and `year`:
```typescript
const placeholders = {
        day: '[0-3][0-9]',
        month: [ 
        'jan', 'feb', 'mar', 'apr', 'may', 'jun',
        'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
        ],
        year: String.raw`(?:19|20)\d{2}\b`
    };
    
const expirationDate = Pattern.new()
    .settings({
        template: '(?:expiration_statement)[: ]+(day)-(month)-(year)'
    })
    .vars({
        expiration_statement: [
            'best-by','use-by','consume before','expiration date','expiry date'
        ],
        day: '{{day}}',
        month: '{{month}}',
        year: '{{year}}'
    })
    .placeholders(placeholders)
    .build();

    >> /(?:best-by|use-by|consume before|expiration date|expiry date)[: ]+([0-3][0-9])-(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)-((?:19|20)\d{2}\b)/

const calendarDate = Pattern.new()
    .settings({
        template: [
            '(day)-(month)-(year)',
            '(month)-(day)-(year)'
        ]
    })
    .placeholders(placeholders)
    .vars({
        day: '{{day}}',
        month: '{{month}}',
        year: '{{year}}'
    })
    .buildAll();

    >> [
        /([0-3][0-9])-(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)-((?:19|20)\d{2}\b)/,
        /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)-([0-3][0-9])-((?:19|20)\d{2}\b)/
    ]
```

### Match Maps
Arrays of matches can be mapped to their pattern's template with the `matchMap` method:
```typescript
    .settings({ template: '(greeting) (region)' })
    .vars({ greeting: 'hello', region: 'world' })
    .build()

    >> /(hello) (world)/

pattern.matchMap('hello world')

>> { full_match: 'hello world', greeting: 'hello', region: 'world' }
```

### Automatic Mapping
When the `map: true` setting is used a pattern will automatically map the array of matches.
```typescript
let pattern = Pattern.new()
    .settings({ template: '(foo)', map: true })
    .vars({ foo: 'bar' })
    .build();

console.log(pattern.match('bar'));

>> { full_match: "bar", foo: "bar" }
```

### Exceptions
Separate desired and unwanted values with the `filter` method. Note that this will restructure your template as `exclude|({the-rest-of-the-template})` and _place any desired full match in capture group 1_ while adding unwanted values to group 0 only.
```typescript
.settings({ template: 'years'})
.vars({ years: String.raw`20\d{2}` })
.filter("2000")

>> /2000|(20\d{2})/
```
When the pattern above matches `2000` the resulting array of matches will not have an index 1, but it will if anything else like `2001` or `2020` is matched.

### Wildcard Pattern
Add a wildcard to be searched for after a set of known values. Note that this will restructure your template as `{the-rest-of-the-template}|(wildcard)`, adding a capture group but not changing the order of existing ones.
```typescript
.settings({ template: 'years' })
.vars({ years: ['2018','2019','2020'] })
.wildcard(String.raw`20\d{2}\b`)

>> /2018|2019|2020|(20\d{2}\b)/
```
Note that with the pattern above any wildcard match will be placed in group 1.

### Custom Variable Symbol
If you'd like to use a more explicit notation for the template variables, you can choose from a few symbols by adding a `symbol` setting when building a `Pattern`:
```typescript
.settings({ template: '#foo', symbol: '#' })   // '#' | '%' | '@' | '!'
.vars({ foo: 'bar'})

>> /bar/
```

If you also need to use a variable name as literal characters escape it with a backslash (keep in mind to use a double backslash in a normal string or `String.raw`):
```typescript
.settings({ template: String.raw`\#foo (?=#foo)`, symbol: '#' })
.vars({ foo: 'baz' })

>> /#foo (?=bar)/
```

### Custom Separator Symbol
If you'd like to join the arrays defined in `vars` with something other than `|` add the `separator` setting:
```typescript
.settings({ template: 'foo (?=bar)', separator: String.raw`\s+`})
.vars({ foo: ['one', 'two', 'three']})
.build()

>> /one\s+two\s+three (?=bar)/
```

## Customizing PatternBuilder

### Custom Template-Building Specification (Experimental)
You can write your own implementation of how to build patterns from template strings. This can allow you to add extra logic or simplify PatternBuilder's default specification to only include what you need.

To start with, any custom specification has to implement `TemplateSpecification`. This means it needs to have a `compose` method which takes a `string` parameter `template` and returns a `string`:
```typescript
interface TemplateSpecification {
    compose(template: string): string;
}
```

Then the builder can be constructed in a slightly more verbose way by adding the custom specification and providing it with an empty data object. After that you can start building as usual:
```typescript
let builder = new PatternBuilder(
    new MyCustomSpecification({
        settings:{template:'',flags:''},
        vars:{},
        placeholders:{}
}));

builder
    .settings({template: 'foo'})
    .vars({foo: 'bar'})
    .build();
```
