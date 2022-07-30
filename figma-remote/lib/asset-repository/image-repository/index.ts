import { BaseImageRepositories } from "@design-sdk/asset-repository";
import { FIGMA_REMOTE_LIB_AUTH_CREDENTIAL_GLOBAL } from "../../configure-auth-credentials/__internal__";
import { fetchImagesOfFile, fetchNodeAsImage } from "../../fetch";
type RemoteImage = string;

export class RemoteImageRepositories extends BaseImageRepositories<RemoteImage> {
  private __node_export_image_map: { [key: string]: RemoteImage } = {};
  private __file_image_map: { [key: string]: RemoteImage } = {};

  private __set_credentials;
  private get credentials() {
    if (this.__set_credentials) {
      return this.__set_credentials;
    }
    return FIGMA_REMOTE_LIB_AUTH_CREDENTIAL_GLOBAL;
  }

  constructor(
    private readonly fileId: string,
    args?: {
      authentication?: {
        personalAccessToken?: string;
        accessToken?: string;
      };
    }
  ) {
    super();

    this.__set_credentials = args.authentication;
  }

  private __fetching: Promise<any>;
  async fetchDataById(id: string): Promise<RemoteImage> {
    if (this.__node_export_image_map[id]) {
      return this.__node_export_image_map[id];
    }

    if (!this.__fetching) {
      this.__fetching = fetchNodeAsImage(this.fileId, this.credentials, id);
    }
    const res = await this.__fetching;
    // update maps with newly retrieved data.
    this.__node_export_image_map = {
      ...this.__node_export_image_map,
      ...res,
    };
    return res[id];
  }

  async fetchAll(...id: string[]) {
    this.__fetching = fetchNodeAsImage(this.fileId, this.credentials, ...id);
    const res = await this.__fetching;
    this.__node_export_image_map = {
      ...this.__node_export_image_map,
      ...res,
    };
    return this.__node_export_image_map;
  }

  async _fetchDataByHash(hash: string): Promise<RemoteImage> {
    if (this.__file_image_map[hash]) {
      return this.__file_image_map[hash];
    }

    this.__file_image_map = await fetchImagesOfFile(
      this.fileId,
      this.credentials
    );
    return this.__file_image_map[hash];
  }
}
