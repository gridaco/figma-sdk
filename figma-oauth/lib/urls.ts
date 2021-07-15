import {
  FigmaOAuthUrlParam,
  FigmaOAuthTokenRequestParam,
  FigmaOAuthTokenRefreshParam,
} from "./types";

/**
 * example:
 *
 * `https://www.figma.com/api/oauth/token?`
 * - `client_id=:client_id&`
 * - `client_secret=:client_secret&`
 * - `redirect_uri=:callback&`
 * - `code=:code&`
 * - `grant_type=authorization_code`
 *
 * will return : https://accounts.grida.co/callback/figma-app-oauth?code=K3p9uhqlntNDrbLe2HMPAFgwf&state=
 */
export function oauthBrowserUrl({
  client_id,
  redirect_uri,
  state,
  scope = "file_read",
  response_type = "code",
}: FigmaOAuthUrlParam) {
  const params = {
    client_id: client_id,
    redirect_uri: redirect_uri,
    scope: scope,
    state: state,
    response_type: response_type,
  };

  const _q_str = new URLSearchParams(params).toString();
  return `https://www.figma.com/oauth?${_q_str}`;
}

/**
 *
 */
export function oauthTokenRequestUrl({
  client_id,
  client_secret,
  grant_type = "authorization_code",
  redirect_uri,
  code,
}: FigmaOAuthTokenRequestParam) {
  const params = {
    client_id: client_id,
    client_secret: client_secret,
    grant_type: grant_type,
    redirect_uri: redirect_uri,
    code: code,
  };
  const _q_str = new URLSearchParams(params).toString();
  return `https://www.figma.com/api/oauth/token?${_q_str}`;
}

export function oauthTokenRefreshUrl({
  client_id,
  client_secret,
  refresh_token,
}: FigmaOAuthTokenRefreshParam): string {
  const params = {
    client_id: client_id,
    client_secret: client_secret,
    refresh_token: refresh_token,
  };
  const _q_str = new URLSearchParams(params).toString();
  return `https://www.figma.com/api/oauth/refresh?${_q_str}`;
}

export const urls = {
  oauth_token_request_url: oauthTokenRequestUrl,
  oauth_token_refresh_url: oauthTokenRefreshUrl,
  oauth_browser_url: oauthBrowserUrl,
};
