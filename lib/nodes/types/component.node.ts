import { ReflectFrameNode } from "./frame.node";

export class ReflectComponentNode extends ReflectFrameNode {
    // FIXME
    // @ts-ignore
    readonly type = ReflectSceneNodeType.component;

    description: string;
    readonly remote: boolean;
    readonly key: string;
}

export class ReflectInstanceNode extends ReflectFrameNode {
    // FIXME
    // @ts-ignore
    readonly type = ReflectSceneNodeType.instance;

    masterComponent: ComponentNode;
}

