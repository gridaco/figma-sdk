# `Figma-OAuth` _(`@design-sdk/Figma-OAuth`)_

> Figma OAuth, ready to use.

## Installation

```sh
yarn add @design-sdk/figma-oauth

# or with npm
npm i @design-sdk/figma-oauth
```

## Usage

```ts
import { urls, request } from "@design-sdk/figma-oauth";

const oauthTokenRequestUrl = urls.oauth_token_request_url({
  client_id,
  client_secret,
  redirect_uri,
  code,
});

const oauthAuthenticationResult = request.authenticationoauth_token_request_url(
  {
    client_id,
    client_secret,
    redirect_uri,
    code,
  }
);
```
