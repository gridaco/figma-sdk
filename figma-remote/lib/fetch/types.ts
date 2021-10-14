import * as types from "@design-sdk/figma-remote-types";
import * as Figma from "@design-sdk/figma-types";
import * as nodes from "@design-sdk/figma-node";

export interface AuthenticationCredential {
  /** access token returned from OAuth authentication */
  readonly accessToken?: string;
  /** personal access token obtained from account settings */
  readonly personalAccessToken?: string;
}

export interface FigmaRemoteImportPack<T = any> {
  file: string;
  node: string;
  raw?: T;
  remote?: types.Node;
  figma?: Figma.SceneNode;
  reflect?: nodes.ReflectSceneNode;
  components?: FigmaRemoteImportPack[];
}
