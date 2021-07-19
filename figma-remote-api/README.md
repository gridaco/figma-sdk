# `Figma-Remote-Api` _(`@design-sdk/figma-remote-api`)_

> figma remote api (figma rest api) for nodejs

## Installation

```sh
yarn add @design-sdk/figma-remote-api

# or with npm
npm i @design-sdk/figma-remote-api
```

## Usage

```ts
import { Client } from "@design-sdk/figma-remote-api";

const client = Client({
  accessToken: "<your-access-token>",
});
```

## Disclamer

The figma remote api responce type definitions from "[figma-js](https://github.com/jongold/figma-js/blob/master/src/figmaTypes.ts)" (MIT)
