# `@design-sdk/query`

```bash
yarn add @design-sdk/query
```

## Usage

```ts
import q from "@design-sdk/query";

// performance efficient on reuse
const doc = q.document(seed);
doc.getNodeById(id);
doc.getNodeAndRootById(id);

// single use
q.getNodeByIdFrom(id, seed);
q.getNodeAndRootByIdFrom(id, seed);
```
