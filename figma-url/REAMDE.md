# `Figma-Url` _(`@design-sdk/figma-url`)_

> figma url reader / parser

## Installation

```sh
yarn add @design-sdk/figma-url

# or with npm
npm i @design-sdk/figma-url
```

## Usage

**url analysis**

```ts
import { analyze, FigmaUrlType } from "@design-sdk/figma-url";

test("analyze url - valid embedding url", () => {
  const _url =
    "https://www.figma.com/embed?embed_host=astra&url=https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/?node-id=264%3A49";
  expect(analyze(_url)).toBe(FigmaUrlType.embed);
});
```

**embed link builder**

```ts
import { embed } from "@design-sdk/figma-url";

test("build embed url", () => {
  const _url =
    "https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/?node-id=264%3A49";
  expect(embed(_url)).toBe(
    "https://www.figma.com/embed?embed_host=astra&url=https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/?node-id=264%3A49"
  );
});

test("build embed url with file & node id", () => {
  expect(embed({ fileid: "Y0Gh77AqBoHH7dG1GtK3xF", nodeid: "264%3A49" })).toBe(
    "https://www.figma.com/embed?embed_host=astra&url=https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/?node-id=264%3A49"
  );
});
```

**parse**

```ts
import { parseFileAndNodeId } from "@design-sdk/figma-url";

// parse fileid & nodeid from url
parseFileAndNodeId(
  "https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/?node-id=264%3A49"
);

// => Y0Gh77AqBoHH7dG1GtK3xF, 264%3A49
```

## `node-id` format

This package both supports `node-id` format with `:`, `%3A` and `-`.

## LICENSE - MIT by [Grida.co](https://grida.co)

## References

- figma embed url - https://www.figma.com/developers/embed
- regex for url validation `/https:\/\/([\w\.-]+\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/`
