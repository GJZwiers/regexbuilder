import { OneOrMultiple } from "../pattern-data/interfaces.ts";

export function toList<T>(input: OneOrMultiple<T>): T[] {
    return (Array.isArray(input)) ? input : [input];
}
