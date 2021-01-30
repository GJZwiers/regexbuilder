interface OneOrMultiMap<T> {
    [key: string]: T[] | T
}

type OneOrMultiple<T> = T[] | T

interface PatternData extends OneOrMultiMap<string> {}

interface PatternSettingsBase {
    template: OneOrMultiple<string>
    flags?: string
}

interface Symbol {
    symbol?: TemplateVarSymbols
}

interface CustomSetting {
    [key: string]: any
}

interface PatternSettings extends PatternSettingsBase, Symbol, CustomSetting {
    separator?: string
}

type TemplateVarSymbols = '%' | '#' | '!' | '@';

export type { OneOrMultiple, OneOrMultiMap, TemplateVarSymbols, PatternData, PatternSettings }
