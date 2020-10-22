import { ReflectSceneNode, ReflectSceneNodeType } from ".";
import { checkIfRoot } from "../../utils/check-if-root";
import { ReflectLayoutMixin, ReflectBlendMixin, ReflectChildrenMixin } from "./mixins";


export interface IReflectNodeReference {
    readonly type: ReflectSceneNodeType
    name: string;
    id: string;
    parentReference?: IReflectNodeReference
}

export class ReflectBaseNode implements IReflectNodeReference, ReflectLayoutMixin, ReflectBlendMixin {
    readonly type: ReflectSceneNodeType

    constructor(props: {
        id: string,
        name: string
    }) {
        this.id = props.id
        this.name = props.name
    }

    locked: boolean
    id: string;
    parent: (ReflectSceneNode & ReflectChildrenMixin) | null;
    name: string;
    readonly pluginData: { [key: string]: string };

    // layout related
    x: number;
    y: number;
    rotation: number; // In degrees
    width: number;
    height: number;
    layoutAlign: "MIN" | "CENTER" | "MAX" | "STRETCH";
    //

    // blen related
    opacity: number;
    blendMode: "PASS_THROUGH" | BlendMode;
    isMask: boolean;
    effects: ReadonlyArray<Effect>;
    effectStyleId: string;
    visible: boolean;
    radius: number;
    //

    get isComponent(): boolean {
        return this.type === "COMPONENT" || this.type == "INSTANCE";
    }

    get isMasterComponent(): boolean {
        return this.type == "COMPONENT";
    }

    get isRoot(): boolean {
        // DANGEROUS
        return checkIfRoot(this as any)
    }

    toString(): string {
        return `"${this.name}"`
    }

    copyAsSnippet(): IReflectNodeReference {
        return <IReflectNodeReference>{
            id: this.id,
            name: this.name,
            type: this.type,
            parentReference: {
                id: this.parent.id,
                name: this.parent.name,
                type: this.parent.type,
            }
        }
    }
}