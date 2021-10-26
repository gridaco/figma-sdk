import { Client } from "@design-sdk/figma-remote-api";

async function withRootPluginData({
  accessToken,
  filekey,
  pluginId,
}: {
  accessToken: string;
  filekey: string;
  pluginId?: string;
}): Promise<string> {
  const client = Client({
    // no support for `personalAccessToken` (only `accessToken`), since this is a package for verifying the checksum in production use.
    accessToken: accessToken,
  });

  const res = await client.file(filekey, {
    depth: 1,
    plugin_data: pluginId ? [pluginId] : "shared", // automatic fallback to "shared", namespace defaults to "global"
  });

  const signature = pluginId
    ? res.data.document.pluginData[pluginId]["signature"]
    : res.data.document.sharedPluginData["global"]["signature"];

  return signature;
}

export const checkSignature = {
  withRootPluginData,
};
