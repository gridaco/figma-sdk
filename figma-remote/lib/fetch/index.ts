import * as types from "@design-sdk/figma-remote-types";
import * as mapper from "../mapper";
import * as api from "@design-sdk/figma-remote-api";
import { convert } from "@design-sdk/figma-node-conversion";
import {
  NotfoundError,
  TokenExpiredUnauthorizedError,
  UnauthorizedError,
} from "./errors";
import type { AuthenticationCredential, FigmaRemoteImportPack } from "./types";
import type { AxiosPromise } from "axios";
export { fetchDemo } from "./demo";
export * from "./errors";
export * from "./types";

type FigmaApiResponse<T> = T & {
  status: /**
   * successful response
   */
  | "success"
    /**
     * the token is expired or invalid
     */
    | "invalid-token"
    /**
     * no permission to access the resource
     */
    | "unauthorized"
    /**
     * requested resource is not found
     */
    | "not-found";
};

export interface FigmaRemoteFetchConfig {
  /**
   * specify if to fetch with explicit out-of-target-scope components.
   */
  with_components?: boolean;
}

const default_config: FigmaRemoteFetchConfig = {
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
  config?: FigmaRemoteFetchConfig;
}): Promise<FigmaApiResponse<FigmaRemoteImportPack>> {
  const partial = await await fetchTarget(file, [node], auth, config);

  const components = [];
  if (config.with_components) {
    Object.keys(partial.components).forEach((key) => {
      const component = partial.components[key];
      const _mapped = mapper.mapFigmaRemoteToFigma(component);
      const _converted = convert.intoReflectNode(_mapped, null, "rest", file);
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
  const _converted = convert.intoReflectNode(_mapped, null, "rest", file);
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
  config?: FigmaRemoteFetchConfig
): Promise<FigmaApiResponse<FigmaRemoteImportPack>> {
  const filekey = partial.file;
  let d: types.Node;
  if (partial.remote) {
    d = partial.remote;
  } else {
    d = await (
      await fetchTarget(partial.file, [partial.node], auth, config)
    ).nodes[partial.node];
  }
  const _mapped = mapper.mapFigmaRemoteToFigma(d as any);
  const _converted = convert.intoReflectNode(_mapped, null, "rest", filekey);
  return {
    ...partial,
    remote: d,
    figma: _mapped,
    reflect: _converted,
    status: "success",
  };
}

export async function fetchTarget(
  file: string,
  ids: string[] | string,
  auth: AuthenticationCredential,
  config?: FigmaRemoteFetchConfig
): Promise<
  FigmaApiResponse<{
    file: string;
    ids: string[];
    nodes: { [key: string]: types.Node };
    components: { [key: string]: types.Node };
  }>
> {
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
      status: "success",
    };
  } catch (e) {
    // catch axios error
    if (e.response) {
      switch (e.response.status) {
        case 404:
          throw new NotfoundError(`Node ${ids} not found in file ${file}`);
        case 403:
          // e.g. {"status":403,"err":"Invalid token"}
          throw new UnauthorizedError(e.response.data.err);
        default:
          throw e;
      }
    }
    throw e;
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
}): AsyncGenerator<FigmaApiResponse<FetchFileGeneratorReturnType>> {
  const client = api.Client(auth);

  try {
    const pagesreq = client.file(file, {
      geometry: "paths",
      depth: 1,
    });

    yield {
      ...(await pagesreq).data,
      __response_type: "pages",
      status: "success",
    };

    const rootsreq = client.file(file, {
      geometry: "paths",
      depth: 2,
    });

    yield {
      ...(await rootsreq).data,
      __response_type: "roots",
      status: "success",
    };

    const wholereq = client.file(file, {
      geometry: "paths",
    });

    yield {
      ...(await wholereq).data,
      __response_type: "whole",
      status: "success",
    };
  } catch (e) {
    if (e.response) {
      switch (e.response.status) {
        case 404:
          throw new NotfoundError(`File ${file} not found`);
        case 403:
          // e.g. {"status":403,"err":"Invalid token"}
          // e.g. {"status":403,"err":"Token expired"}
          switch (e.response.data.err) {
            case "Invalid token":
              throw new UnauthorizedError(e.response.data.err);
            case "Token expired":
              throw new TokenExpiredUnauthorizedError(e.response.data.err);
            default:
              throw new UnauthorizedError(e.response.data.err);
          }
        default:
          throw e;
      }
    }
    throw e;
  }

  return;
}

export async function fetchImagesOfFile(
  file: string,
  auth: AuthenticationCredential
): Promise<FigmaApiResponse<{ [key: string]: string }>> {
  const client = api.Client({
    ...auth,
  });

  const res = await client.fileImageFills(file);
  if (!res.data.error && res.data.status == 200) {
    const images_maps = res.data.meta.images;
    return { ...images_maps, status: "success" };
  }

  // if failed, return empty map.
  return {
    status: "unauthorized",
  };
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
): Promise<
  FigmaApiResponse<{ [key: string]: string } | { __default: string }>
> {
  const client = api.Client({
    ...auth,
  });

  nodes = [...new Set(nodes)].filter((n) => !!n);

  // ids are added to url, which if the url is longer than 2048 chars, it will fail.
  // the prefix is https://api.figma.com/v1/images/xxxxxxxxxxxxxxxxxxxxxx?ids= - which the length is 60 chars.
  if (nodes.join(",").length >= 1988) {
    const reqs = [];
    // split nodes with 100 items per request. with for loop
    for (let i = 0; i < nodes.length; i += 100) {
      reqs.push(
        client.fileImages(file, {
          ids: nodes.slice(i, i + 100),
        })
      );
    }

    const res = await Promise.all<AxiosPromise<types.FileImageResponse>>(reqs);
    const images = res.reduce(
      (p, c) => ({
        ...p,
        ...((c as any).data as types.FileImageResponse).images,
      }),
      {}
    );
    return { ...images, status: "success" };
  } else {
    const res = await client.fileImages(file, {
      ids: nodes,
    });

    if (res.data && !res.data.err) {
      const images_maps = res.data.images;

      if (nodes.length == 1) {
        return {
          ...images_maps,
          __default: images_maps[nodes[0]],
          status: "success",
        };
      }

      return { ...images_maps, status: "success" };
    }
  }

  // if failed, return empty map.
  return {
    status: "unauthorized",
  };
  //
}
