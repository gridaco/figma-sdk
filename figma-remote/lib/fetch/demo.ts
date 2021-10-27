import { default_set } from "./figma-default-set";
import type { AuthenticationCredential, FigmaRemoteImportPack } from "./types";
import * as api from "@design-sdk/figma-remote-api";

export async function fetchDemo(
  auth: AuthenticationCredential
): Promise<FigmaRemoteImportPack> {
  const _nid = default_set.FIGMA_BRIDGED_DEMO_APP_ENTRY_NODE_ID;
  const _fid = default_set.FIGMA_BRIDGED_DEMO_APP_FILE_ID;
  const client = api.Client({
    ...auth,
  });

  const nodesRes = await client.fileNodes(_fid, {
    ids: [_nid],
    geometry: "paths",
  });

  const nodes = nodesRes.data.nodes;

  const demoEntryNode = nodes[_nid];

  const d = demoEntryNode.document;
  return {
    file: _fid,
    node: _nid,
    remote: d,
    components: [],
  };
}
