interface PatternSettingsBase {
    template: string | string[]
    flags?: string
}

type TemplateVarSymbol = '%' | '#' | '!' | '@';

interface Symbol {
    symbol?: TemplateVarSymbol
}

interface Maps {
    map?: boolean
}

interface CustomSetting {
    // deno-lint-ignore no-explicit-any
    [key: string]: any
}

interface PatternSettings extends PatternSettingsBase, Symbol, Maps, CustomSetting {
    separator?: string
}

interface PatternData {
    [key: string]: string | string[]
}

export type { PatternSettingsBase, TemplateVarSymbol, PatternSettings, CustomSetting, PatternData }