<!-- WIP -->

# Asset Repository

```bash
yarn add @design-sdk/asset-repository
```

```ts
import R, { resolve } from "@design-sdk/asset-repository";
import {} from "@design-sdk/asset-repository-plugin-figma";
const provider = new FigmaAssetProvider({});

R.register();
```

## Use cases

- When you mark required assets on code generation. once the code generation is complete, fetch those images and replace the source.
- When you export node json on figma plugin. you can export each layer on final step.
