import { plugin } from "@design-sdk/figma";
import { SIGNATURE_STORE_KEY } from "../k";
import { nanoid } from "nanoid/non-secure";
import { FigmaChecksumBase } from "../base";
import { checkSignature } from "../service";

export class FigmaRootNodeStoreVerification extends FigmaChecksumBase {
  remoteMethod(): Promise<string> {
    return checkSignature.withRootPluginData({
      accessToken: this.accessToken,
      filekey: this.fileKeyUserProvided,
    });
  }

  async prewarm() {
    await Promise.resolve();

    if (!exists()) {
      set();
    }
  }

  clear() {
    update(""); // `""` is `null` equivalent on figma pluginData
  }
}

function get(): string {
  return plugin.root.getPluginData(SIGNATURE_STORE_KEY);
}

function exists(): boolean {
  // will return false when get() is `""`
  return Boolean(get());
}

function update(signature: string) {
  plugin.root.setPluginData(SIGNATURE_STORE_KEY, signature);
}

function set(): string {
  const _ = nanoid();
  update(_);
  return _;
}
