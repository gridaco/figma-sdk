function get(): string {
  return figma.root.getPluginData("filekey");
}

function set(filekey: string) {
  figma.root.setPluginData("filekey", filekey);
}

export const filekeyOnRoot = {
  get,
  set,
};
