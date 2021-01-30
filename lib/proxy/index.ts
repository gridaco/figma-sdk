import { TargetPlatform } from "../platform";

abstract class ProxyClient {
  readonly platform: TargetPlatform;
  constructor(props: { platform: TargetPlatform }) {
    // figma.getNodeById();
  }
  abstract apiVersion: string;

  async fetchNode(id: string) {
    if (this.platform == TargetPlatform.figma) {
      return figma.getNodeById(id);
    }
  }
}

class FigmaProxyClient extends ProxyClient {
  get apiVersion() {
    return figma.apiVersion;
  }
}
