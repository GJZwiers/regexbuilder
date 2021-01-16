interface PatternData {
    [key: string]: string[] | string
}

interface PatternPlaceholders {
    [key: string]: string[]
}

interface PatternSettingsBase {
    template: string | string[]
    flags?: string
}

interface AnySetting {
    [key: string]: any
}

interface PatternSettings extends PatternSettingsBase, AnySetting {
    separator?: string
}

export type { PatternData, PatternSettings, PatternPlaceholders }