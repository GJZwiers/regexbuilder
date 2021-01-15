interface RegexData {
    [key: string]: string[] | string
}

interface RegexPlaceholders {
    [key: string]: string[]
}

interface RegexSettingsBase {
    flags?: string
    template: string | string[]
}

interface AnySetting {
    [key: string]: any
}

interface RegexSettings extends RegexSettingsBase, AnySetting {
    separator?: string
}

export type { RegexData, RegexSettings, RegexPlaceholders }