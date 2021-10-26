# Figma checksum

Figma file key checksum for verifying user provided figma file key to match via remote api call.

## Quickstart

**Installation**

```sh
yarn add @design-sdk/figma-checksum
```

**Default use**

```ts
import { FigmaRootNodeStoreVerification } from "@design-sdk/figma-checksum";

async function check() {
  const proc = new FigmaRootNodeStoreVerification();
  await proc.prewarm(); // required

  // use your custom authentication logic
  const figmaAuthentication = await propmpUserAuthentication();

  // set the access token before calling verify. you can skip this step if you are using `@design-sdk/figma-auth-store`
  proc.accessToken = figmaAuthentication.accessToken;

  const verified = proc.verify();
  if (verified) {
    proc.clear();
    // add your custom after logic here.
  } else {
    prompt(
      "file verification failed - the filekey you provided does not match signature."
    );
  }
}
```

## Strategy - with-root-node-store (cleanest)

This strategy uses a plugin store, `setPluginData` on root node, checks the same checksum value on remote api for validation. The only problem of this is we can't always trust the plugin data set by `setPluginData` will be available at the access time. Since the plugin runs on local app, the app can sometime take up some delay to sync that data with figma server.

AFAIK, the data sync is also done by background socket connection, which we don't have to worry about the data-sync-delay of figma

```ts
import { FigmaRootNodeStoreVerification } from "@design-sdk/figma-checksum";

async function check() {
  const proc = new FigmaRootNodeStoreVerification();
  await proc.prewarm(); // required

  // use your custom authentication logic
  const figmaAuthentication = await propmpUserAuthentication();

  // set the access token before calling verify. you can skip this step if you are using `@design-sdk/figma-auth-store`
  proc.accessToken = figmaAuthentication.accessToken;

  const verified = proc.verify();
  if (verified) {
    proc.clear();
    // add your custom after logic here.
  } else {
    prompt(
      "file verification failed - the filekey you provided does not match signature."
    );
  }
}
```

## Strategy - with-otp-node (almost safest)

This creates a new page and node containing the same checksum data, but physically in the file. This is the safest way to do it, but it's not the cleanest. It also has a risk user deleting the page before verification is complete.

```ts
// not implemented
```

## Strategy - with-pages-signature (use with caution)

This is a valid strategy when validating a complex file, but the new-born file page ids will be generated with patterns by order it's been created. e.g. the first page created is always `0:1`

e.g.

```json
// example of page ids by creation order
["0:1", "0:3", "1:3", "1:4"]
```

This is hardly a problem, on real-world usecase, but it is also true that some user might have multiple files with only one page created.

```ts
// not implemented
```
