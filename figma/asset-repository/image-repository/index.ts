import { BaseImageRepositories } from "@design-sdk/asset-repository";
import { plugin } from "../../";

export class ImageRepositories extends BaseImageRepositories {
  async fetchDataById(
    id: string,
    config?: {
      type: "original";
    }
  ): Promise<Uint8Array> {
    const node = plugin.getNodeById(id);
    if (node.type == "DOCUMENT") {
      return;
    } else {
      if (config?.type == "original") {
        return await node.exportAsync({
          format: "PNG",
          // no constraints
        });
      }
      return await node.exportAsync({
        format: "PNG",
        constraint: {
          value: 300,
          type: "WIDTH",
        },
      });
    }
  }

  async _fetchDataByHash(hash: string): Promise<Uint8Array> {
    const image = plugin.getImageByHash(hash);
    return image.getBytesAsync();
  }

  fetchAll(...id: string[]): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
