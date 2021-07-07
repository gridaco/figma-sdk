import * as types from "../types";
import * as mapper from "../mapper";
import * as api from "../api";
import * as Figma from "@design-sdk/figma-types";
import { default_set } from "./figma-default-set";
import { convert, nodes } from "@design-sdk/figma";

export interface AuthenticationCredential {
  /** access token returned from OAuth authentication */
  readonly accessToken?: string;
  /** personal access token obtained from account settings */
  readonly personalAccessToken?: string;
}

export interface FigmaRemoteImportPack {
  file: string;
  node: string;
  remote?: types.Node;
  figma?: Figma.SceneNode;
  reflect?: nodes.ReflectSceneNode;
}

export async function fetchTargetAsReflect(
  file: string,
  node: string,
  auth: AuthenticationCredential
): Promise<FigmaRemoteImportPack> {
  const partial = await await fetchTarget(file, node, auth);
  const _mapped = mapper.mapFigmaRemoteToFigma(partial.remote as any);
  const _converted = convert.intoReflectNode(_mapped);
  return {
    ...partial,
    figma: _mapped,
    reflect: _converted,
  };
}

export async function completePartialPack(
  partial: FigmaRemoteImportPack,
  auth?: AuthenticationCredential
): Promise<FigmaRemoteImportPack> {
  let d: types.Node;
  if (partial.remote) {
    d = partial.remote;
  } else {
    d = await (await fetchTarget(partial.file, partial.node, auth)).remote;
  }
  const _mapped = mapper.mapFigmaRemoteToFigma(d as any);
  const _converted = convert.intoReflectNode(_mapped);
  return {
    ...partial,
    remote: d,
    figma: _mapped,
    reflect: _converted,
  };
}

export async function fetchTarget(
  file: string,
  node: string,
  auth: AuthenticationCredential
): Promise<FigmaRemoteImportPack> {
  const client = api.Client({
    ...auth,
  });

  const nodesRes = await client.fileNodes(file, {
    ids: [node],
  });
  const nodes = nodesRes.data.nodes;

  const demoEntryNode = nodes[node];

  return {
    file: file,
    node: node,
    remote: demoEntryNode.document,
  };
}

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
  });

  const nodes = nodesRes.data.nodes;

  const demoEntryNode = nodes[_nid];

  const d = demoEntryNode.document;
  return {
    file: _fid,
    node: _nid,
    remote: d,
  };
}
