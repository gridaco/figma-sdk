import { BaseImageRepositories } from "@design-sdk/core/assets-repository/image-repository";
import { figma } from "../../";

export class ImageRepositories extends BaseImageRepositories {
  async fetchDataById(
    id: string,
    config?: {
      type: "original";
    }
  ): Promise<Uint8Array> {
    const node = figma.getNodeById(id);
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
    const image = figma.getImageByHash(hash);
    return image.getBytesAsync();
  }

  fetchAll(...id: string[]): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
