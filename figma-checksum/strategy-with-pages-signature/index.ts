import { figma } from "@design-sdk/figma";

const IDENTITY_KEY = "figma-file-checksum-identity";

interface FigmaIdentityStore {
  [key: string]: FigmaIdentityByPages;
}

interface FigmaIdentityByPages {
  /**
   * the name of root node - file name.
   * we don't actually use this for identity check, it's for debug purpose. (this can easily be changed by user)
   */
  name: string;
  /**
   * ids of pages
   */
  pages: string[];
}

function getIdentity() {}

function setIdentity() {
  const identity = makeIdentity();
  figma.clientStorage.setAsync(IDENTITY_KEY, identity);
}

function setIdentityFrom(name: string, ...pages: string[]) {
  const identity = makeIdentityFrom(name, ...pages);
  figma.clientStorage.setAsync(IDENTITY_KEY, identity);
}

function makeIdentity(): FigmaIdentityByPages {
  const pages = figma.root.children;
  const pagesids = pages.map((page) => page.id);
  return makeIdentityFrom(figma.root.name, ...pagesids);
}

function makeIdentityFrom(
  name: string,
  ...pages: string[]
): FigmaIdentityByPages {
  return {
    name,
    pages,
  };
}

function saveonRoot() {
  figma.root.setPluginData(
    "filekey",
    "" // TODO: get the file key
  );
}
