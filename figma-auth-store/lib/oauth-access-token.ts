import { FigmaAuthStore } from "./figma-auth-store";

const ___key = "oauth-access-token"
const key = () => {
    return FigmaAuthStore.makekey(___key)
}

const _dev_env_var_figma_personal_access_token = process.env.FIGMA_PERSONAL_ACCESS_TOKEN
export function storeFigmaToken(figmaToken: string) {
    window.localStorage.setItem(key(), figmaToken);
}

export function getFigmaToken(): string | undefined {
    const stored = window.localStorage.getItem(key()) as string;
    return stored || _dev_env_var_figma_personal_access_token;
}

export function refreshFigmaToken() {
    throw 'refresh token not implemented.'
}