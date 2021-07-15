import Axios from "axios";
import {
  FigmaOAuthTokenRequestParam,
  FigmaOAuthTokenResponse,
  FigmaOAuthTokenRefreshResponse,
  FigmaOAuthTokenRefreshParam,
} from "./types";
import { oauthTokenRefreshUrl, oauthTokenRequestUrl } from "./urls";

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
    })
  );

  return res.data;
}

/**
 * [Refreshing OAuth tokens](https://www.figma.com/developers/api#refresh-oauth2)
 * 
 * ```
    POST https://www.figma.com/api/oauth/refresh?
    client_id=:client_id&
    client_secret=:client_secret&
    refresh_token=:refresh_token

    {
        "access_token": <TOKEN>,
        "expires_in": <EXPIRATION (in seconds)>,
    }
 * ```
 */
export async function refreshOauthToken({
  client_id,
  client_secret,
  refresh_token,
}: FigmaOAuthTokenRefreshParam): Promise<FigmaOAuthTokenRefreshResponse> {
  const res = await Axios.post<FigmaOAuthTokenRefreshResponse>(
    oauthTokenRefreshUrl({
      client_id,
      client_secret,
      refresh_token,
    })
  );

  return res.data;
}

export const request = {
  authentication: requestOauthToken,
  tokenrefresh: refreshOauthToken,
};
