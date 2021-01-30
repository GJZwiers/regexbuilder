export function validatePattern(parts: string): void {
    let openers = 0, closers = 0;
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] === '(' && parts[i-1] !== '\\') {
            openers++;
        } else if (parts[i] === ')' && parts[i-1] !== '\\') {
            closers++;
        }
    }
    if (Math.abs(closers-openers) !== 0) {
        throw new Error("(regexbuilder) Found uneven number of parentheses in a pattern.");
    }
}
