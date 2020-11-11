import { typographyIntelisenceMapping } from "@reflect.bridged.xyz/linter/lib/constants/naming-conventions/text-theme.naming"


export function getTextStyleById(id: string): TextStyle {
    if (id === undefined || id === null) {
        throw `the parameter id of ${id} is not valid. maybe your text does not have a assiged textstyle`;
    }
    for (const s of figma.getLocalTextStyles()) {
        if (id === s.id) {
            return s;
        }
    }
    throw `text style of id "${id}" is not found by api`;
}


/**
 * if the last index is older than 1 second, re index in next execution. this is just to prevent performance leak while running single build process
 */
const INDEX_UPDATE_INTERVAL_MS = 1000
export class TextStyleRepository {
    private static _textThemeMapping: Map<TextThemeStyles, Map<string, TextStyle>>
    private static _mapping: Map<string, TextStyle>
    private static _lastIndex: number = 0
    static get textThemeMapping(): Map<TextThemeStyles, Map<string, TextStyle>> {
        const indexingRequired = (!this._textThemeMapping || Date.now() - this._lastIndex > INDEX_UPDATE_INTERVAL_MS)
        if (indexingRequired) {
            this.index()
        }
        return this._textThemeMapping
    }

    private static index() {
        this._textThemeMapping = new Map<TextThemeStyles, Map<string, TextStyle>>()
        this._mapping = new Map<string, TextStyle>()
        const textThemeStyles = figma.getLocalTextStyles()
        for (const textThemeStyle of textThemeStyles) {
            this._mapping[textThemeStyle.name] = textThemeStyle
            const style = findOneStyle(textThemeStyle.name)
            if (style) {
                if (!this._textThemeMapping[style.type]) {
                    this._textThemeMapping[style.type] = new Map<string, TextStyle>()
                }
                (this._textThemeMapping[style.type] as Map<string, TextStyle>)[style.variant] = textThemeStyle
            }
        }
    }

    static getDefaultDesignTextStyleFromRegistry(textStyle: TextThemeStyles): TextStyle {
        const set = this.getDesignTextStyleSetFromRegistry(textStyle)
        const keys = Object.keys(set)
        // return first as default
        return set[keys[0]]
    }

    static getDesignTextStyleSetFromRegistry(textStyle: TextThemeStyles): Map<string, TextStyle> {
        return this.textThemeMapping[textStyle]
    }

    static getStyleDefFromTextStyleName(textStyleName: string): TextThemeStyles {
        const themeMapping = this.textThemeMapping
        for (const typekey of Object.keys(themeMapping)) {
            const variantMap = themeMapping[typekey]
            for (const variantkey of Object.keys(variantMap)) {
                const textStyle: TextStyle = variantMap[variantkey] as TextStyle
                if (textStyle.name === textStyleName) {
                    return TextThemeStyles[typekey];
                }
            }
        }
        throw `No matching textstyle guideline for name "${textStyleName}" found.`
    }
}

export enum TextThemeStyles {
    headline1 = 'headline1',
    headline2 = 'headline2',
    headline3 = 'headline3',
    headline4 = 'headline4',
    headline5 = 'headline5',
    headline6 = 'headline6',
    subtitle1 = 'subtitle1',
    subtitle2 = 'subtitle2',
    bodyText1 = 'bodyText1',
    bodyText2 = 'bodyText2',
    button = 'button',
    caption = 'caption',
    overline = 'overline',
}


function findOneStyle(textStyleName: string): {
    // the type
    type: TextThemeStyles,
    // the variant, e.g. sm/h1, xl/h1
    variant: string
} {
    for (const key of typographyIntelisenceMapping.keys()) {
        for (const canditate of typographyIntelisenceMapping.get(key)) {
            if (textStyleName.toLowerCase().includes(canditate)) {
                return {
                    type: TextThemeStyles[key] as TextThemeStyles,
                    variant: textStyleName // TODO update this logic to include size variants or some what helpful
                }
            }
        }
    }
}