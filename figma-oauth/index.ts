import Axios from "axios";

export interface FigmaOAuthUrlParam {
  client_id: string;

  redirect_uri: string;

  /**
   * Currently this value can only be file_read signifying
   * read-only access to the user's files.
   */
  scope?: "file_read";

  /**
   * This is a value that you should randomly generate and store.
   * When we call back to your callback endpoint,
   * you should check that the state value we pass back to you matches the state value that you initially used in your request.
   */
  state: string;

  /**
   * Currently we only support the authorization code flow for OAuth 2,
   * so the only valid value here is code.
   * We may support other values in the future.
   */
  response_type?: "code";
}

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

interface FigmaOAuthTokenRequestParam {
  client_id: string;
  client_secret: string;
  grant_type?: string;
  redirect_uri: string;
  code: string;
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

export interface FigmaOAuthTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

/**
 * The format of the response body is:
 * ```json
 *  {
      "access_token": "<TOKEN>",
      "expires_in": "<EXPIRATION (in seconds)>",
      "refresh_token": "<REFRESH TOKEN>"
    }
 * ``` 
 */
export async function requestOauthToken({
  client_id,
  client_secret,
  grant_type = "authorization_code",
  redirect_uri,
  code,
}: FigmaOAuthTokenRequestParam): Promise<FigmaOAuthTokenResponse> {
  const res = await Axios.post<FigmaOAuthTokenResponse>(
    oauthTokenRequestUrl({
      client_id,
      client_secret,
      redirect_uri,
      grant_type,
      code,
    }),
  );

  return res.data;
}

export function oauthTokenRefreshUrl({
  client_id,
  client_secret,
  refresh_token,
}: {
  client_id: string;
  client_secret: string;
  refresh_token: string;
}): string {
  const params = {
    client_id: client_id,
    client_secret: client_secret,
    refresh_token: refresh_token,
  };
  const _q_str = new URLSearchParams(params).toString();
  return `https://www.figma.com/api/oauth/refresh?${_q_str}`;
}
