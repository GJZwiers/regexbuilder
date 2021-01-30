/**
 * Converts an array to a Set, which must have unique values. Returns true if the length of the set differs from the length of the original array, or false otherwise.
 * @template T
 * @param {T} t
 * @param array
 */
export function hasDuplicates<T>(array: T[]): boolean {
    return new Set(array).size !== array.length;
}
