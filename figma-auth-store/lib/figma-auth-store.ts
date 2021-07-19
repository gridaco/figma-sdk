
export interface FigmaAuthStoreOptions {
    /** e.g prefix = 'figma/' => 'figma/persianl-access-token'
     * 
     * defaults to 'figma/'
     */
    prefix?: string
}

export class FigmaAuthStore {
    static __options: FigmaAuthStoreOptions
    static get options(): FigmaAuthStoreOptions {
        return this.__options
    }

    static configure({
        prefix = 'figma/'
    }: FigmaAuthStoreOptions) {
        this.__options.prefix = prefix
    }

    static makekey(key: string): string {
        return this.options.prefix + key
    }
}