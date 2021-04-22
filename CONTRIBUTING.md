# Style Guide

Contributions are always welcome! Below you will find a few guidelines that you can use to make sure contributions are of good quality. They are loosely based on the [Deno](https://github.com/denoland/deno/blob/main/docs/contributing/style_guide.md) community guidelines.

Start contributing by forking this project and make a pull request (PR) back to this repo when changes are ready.

### Use TypeScript
It is highly recommended to use TypeScript over JavaScript when contributing code. Please keep the style of your code consistent with the rest of the source code.

### Include tests
Please provide a test module with any new code module you want to add.

### Use JSDoc comments
Try to explain in a concise manner what your functions/classes are used for. It is not needed to annotate parameters with `@params` in JSDoc comments. Try to minimize vertical spacing.

Bad:
```typescript
/**
 * This is a single line doc comment.
*/
```
Good:
```typescript 
/** This is a single line doc comment. */
```

### Use 0-2 arguments for functions plus, if needed, an options object

### Export interfaces that are used as parameters of exported members

```typescript
export interface Shape {
  x: number,
  y: number
}

export function move(shape: Shape): void {
  shape.x += 1;
  shape.y += 1;
}
```

### Be explicit in both source code and tests

Bad:
```typescript
var thing = 'Bob';
```

Good:
```typescript
const firstName = 'Bob';
```

Bad test:
```typescript
describe('new thing', () => {
  it('is like totally cool', () => {
    expect(thing).to.equal(9999);
  }
};
```

Good test:
```typescript
const generator = new OverNineThousandGenerator();
describe('OverNineThousandGenerator', () => {
  it('should generate a pseudo-random number above the number 9000', () => {
    const minimum = 9000;
    expect(generator.generate()).toBeGreaterThan(minimum);
  }
};
```

### Don't use arrow syntax for top-level functions
Use the `function` keyword for top-level functions and use arrow functions for closures only.

Bad:
```typescript
const driveCar = (fuel: Fuel) => {
  
}

```
Good:
```typescript
function driveCar(fuel: Fuel) {
  
}
```

# Pull Requests

Please provide a descriptive title and summary of what you made/changed in the PR as well as in your commit messages. It is recommended to use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) to style your commit messages. Make sure that the Continuous Integration (CI) pipeline runs successfully.
