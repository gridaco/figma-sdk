# `@design-sdk/figma-core`

This is used internally by the `@design-sdk/figma` family of packages.

```sh
yarn add @design-sdk/figma-core
```

## File Key

```ts
import type { FigmaFileKey } from "@design-sdk/figma-core";
import { figma_special_filekeys } from "@design-sdk/figma-core";

const figmafilekey: FigmaFileKey =
  figma_special_filekeys.anonymous_figma_plugin_file_key;
```

## Mixed

```ts
import { mixed } from "@design-sdk/figma-core";

// define type
interface SomeFigmaNode {
  propertyA: number | typeof mixed;
}
```
