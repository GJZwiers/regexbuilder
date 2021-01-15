# RegexBuilder

This module allows you to create regex patterns according to string templates. It exposes a fluent builder API for you to use. 

Here's what a full build might look like:
```typescript
import { Pattern } from './builder.ts';

function main(): void {
    let pattern = Pattern.new()
        .settings({
            template: '(greetings) (?=environments)',
            flags: 'i'
        })
        .data({
            greetings: [ 'Hello', 'Good Morning', 'Howdy' ],
            environments: [ 'World', 'New York', '{{foo}}' ]
        })
        .placeholders({ foo: ['bar'] })
        .except(['Sup', 'What is up'])
        .build();
}
```

## Templates
Give the parts of any pattern a name, whether they are inside a capture group or not. Any word in the template will be substituted with the values of the corresponding key in the data. Any array in the data will be joined with pipe `|` symbols to create alternates.
```typescript
.settings({
    template: 'field_name[: ]+(field_values)'
})
.data({
    field_names: ['Product Volume', 'volume']
    field_values: [ '100ml', '5L', '\\d{1,4}[cml]']
})
```

## Placeholders
Declare a set of placeholders to be reused in multiple patterns:
```typescript
const ph = {
    foo: ['bar', 'baz'],
};

Pattern.new()
    // ..
    .placeholders(ph)
```

## Exceptions
Exclude values you know you don't want in your match results. Note that this will restructure your template as `exclude|({the-rest-of-the-template})` and place any desired full match in capture group 1.
```typescript
Pattern.new()
    .settings({ template: 'years'})
    .data({ years: String.raw`20\d{2}` })
    .except(["2000"])
    .build()
```
The pattern above will become `/2000|(20\d{2})/`. It puts the excluded value in capture group 0 and a valid match in group 1.
