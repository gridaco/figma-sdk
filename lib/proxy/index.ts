abstract class ProxyClient {
    abstract apiVersion: string
}


class FigmaProxyClient extends ProxyClient {
    get apiVersion() {
        return figma.apiVersion
    }
}