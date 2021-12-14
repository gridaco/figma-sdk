import * as types from "@design-sdk/figma-remote-types";
import * as mapper from "../mapper";
import * as api from "@design-sdk/figma-remote-api";
import { convert } from "@design-sdk/figma";
import { NotfoundError, UnauthorizedError } from "./errors";
import type { AuthenticationCredential, FigmaRemoteImportPack } from "./types";

export { fetchDemo } from "./demo";
export * from "./errors";
export * from "./types";

export interface FimgaRemoteFetchConfig {
  /**
   * specify if to fetch with explicit out-of-target-scope components.
   */
  with_components?: boolean;
}

const default_config: FimgaRemoteFetchConfig = {
  with_components: true,
};

export async function fetchTargetAsReflect({
  file,
  node,
  auth,
  config = default_config,
}: {
  file: string;
  node: string;
  auth: AuthenticationCredential;
  config?: FimgaRemoteFetchConfig;
}): Promise<FigmaRemoteImportPack> {
  const partial = await await fetchTarget(file, [node], auth, config);

  const components = [];
  if (config.with_components) {
    Object.keys(partial.components).forEach((key) => {
      const component = partial.components[key];
      const _mapped = mapper.mapFigmaRemoteToFigma(component);
      const _converted = convert.intoReflectNode(_mapped);
      components.push(<FigmaRemoteImportPack>{
        file: file,
        node: component.id,
        figma: _mapped,
        reflect: _converted,
        _converted,
      });
    });
  }

  const _mapped = mapper.mapFigmaRemoteToFigma(partial.nodes[node]);
  const _converted = convert.intoReflectNode(_mapped);
  return {
    ...partial,
    node: node,
    remote: partial.nodes[node],
    raw: partial,
    figma: _mapped,
    reflect: _converted,
    components: components,
  };
}

export async function completePartialPack(
  partial: FigmaRemoteImportPack,
  auth?: AuthenticationCredential,
  config?: FimgaRemoteFetchConfig
): Promise<FigmaRemoteImportPack> {
  let d: types.Node;
  if (partial.remote) {
    d = partial.remote;
  } else {
    d = await (
      await fetchTarget(partial.file, [partial.node], auth, config)
    ).nodes[partial.node];
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
  ids: string[] | string,
  auth: AuthenticationCredential,
  config?: FimgaRemoteFetchConfig
): Promise<{
  file: string;
  ids: string[];
  nodes: { [key: string]: types.Node };
  components: { [key: string]: types.Node };
}> {
  ids = Array.isArray(ids) ? ids : [ids];
  const client = api.Client({
    ...auth,
  });

  try {
    const nodesRes = await client.fileNodes(file, {
      ids: ids,
      geometry: "paths",
    });

    const nodes = nodesRes.data.nodes;

    // region fetch components
    let component_nodes: { [key: string]: types.Node } = {};
    if (config.with_components) {
      const nested_ids = Object.keys(nodes).map((k) => {
        // this nested component fetching operation is not recursive. the root request holds all the nested used components ids, so we only have to call one more shot.
        const components_map = nodes[k].components;
        const ids = Object.keys(components_map);
        return ids;
      });
      // uniqye id array
      const ids = [...new Set(nested_ids.flat(1))];

      // fetch nodes again from the file with extra components id.
      // note that we are using the same api since `GET/v1/files/:file_key/components` is only for fetching the published components.
      if (ids.length > 0) {
        const components_fetch_result = await client.fileNodes(file, {
          ids: ids,
          geometry: "paths",
        });

        Object.keys(components_fetch_result.data.nodes).map((k) => {
          component_nodes[k] = components_fetch_result.data.nodes[k].document;
        });
      }
    }
    // endregion fetch components

    return {
      file: file,
      ids: ids,
      nodes: Object.keys(nodes).reduce((acc, k) => {
        acc[k] = nodes[k].document;
        return acc;
      }, {}),
      components: component_nodes,
    };
  } catch (e) {
    switch (e.status) {
      case 404:
        throw new NotfoundError(`Node ${ids} not found in file ${file}`);
      case 403:
        throw new UnauthorizedError(e);
      default:
        throw e;
    }
  }
}

export type FetchFileGeneratorReturnType = types.FileResponse & {
  __response_type: "pages" | "roots" | "whole";
};
export async function* fetchFile({
  file,
  auth,
}: {
  file: string;
  auth: AuthenticationCredential;
}): AsyncGenerator<FetchFileGeneratorReturnType> {
  const client = api.Client(auth);
  const pagesreq = client.file(file, {
    geometry: "paths",
    depth: 1,
  });

  const rootsreq = client.file(file, {
    geometry: "paths",
    depth: 2,
  });

  const wholereq = client.file(file, {
    geometry: "paths",
  });

  yield { ...(await pagesreq).data, __response_type: "pages" };
  yield { ...(await rootsreq).data, __response_type: "roots" };
  yield { ...(await wholereq).data, __response_type: "whole" };
  return;
}

export async function fetchImagesOfFile(
  file: string,
  auth: AuthenticationCredential
): Promise<{ [key: string]: string }> {
  const client = api.Client({
    ...auth,
  });

  const res = await client.fileImageFills(file);
  if (!res.data.error && res.data.status == 200) {
    const images_maps = res.data.meta.images;
    return images_maps;
  }

  // if failed, return empty map.
  return {};
}

/**
 *
 * if only one image is requested, it will extend a object, you can access with `res.__default`.
 *
 * @param file
 * @param auth
 * @param nodes
 * @returns
 */
export async function fetchNodeAsImage(
  file: string,
  auth: AuthenticationCredential,
  ...nodes: string[]
): Promise<{ [key: string]: string } | { __default: string }> {
  const client = api.Client({
    ...auth,
  });

  nodes = nodes.filter((n) => !!n);

  const res = await client.fileImages(file, {
    ids: nodes,
  });

  if (res.data && !res.data.err) {
    const images_maps = res.data.images;

    if (nodes.length == 1) {
      return { ...images_maps, __default: images_maps[nodes[0]] };
    }

    return images_maps;
  }

  // if failed, return empty map.
  return {};
  //
}
