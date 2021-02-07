/** Converts an array to a Set, which must have unique values. Returns true if the length of the set differs from the length of the original array, or false otherwise. */
export function hasDuplicates<T>(array: T[]): boolean {
    return new Set(array).size !== array.length;
}