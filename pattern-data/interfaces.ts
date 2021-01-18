interface PatternData {
    [key: string]: string[] | string
}

interface PatternSettingsBase {
    template: string[] | string
    flags?: string
}

interface CustomSetting {
    [key: string]: any
}

interface PatternSettings extends PatternSettingsBase, CustomSetting {
    separator?: string
}

export type { PatternData, PatternSettings }