export function stringOrRegExp(arg: string | RegExp) {
    return (typeof arg === 'string') ?  arg : arg.source;
}