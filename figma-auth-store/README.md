# `Figma-Auth-Store` _(`@design-sdk/figma-auth-store`)_

> Figma Auth Store, Crendentials storage & management for nodejs

## Installation

```sh
yarn add @design-sdk/figma-auth-store

# or with npm
npm i @design-sdk/figma-auth-store
```

## Usage

```ts
import { getAccessToken, getAccessToken_safe, personal, oauth, FigmaAuthStore } "@design-sdk/figma-auth-store";

FigmaAuthStore.configure({
    prefix: "figma/" // optional, defaults to "figma/"
})


// this throws when token is not available.
const accessToken = getAccessToken()

// this returns null when token is not available.
const accessToken_safe = getAccessToken_safe()


// set token
personal.set('<your-personal-access-token>')
oauth.set('<token-retrieved-from-figma-oauth>')
```
