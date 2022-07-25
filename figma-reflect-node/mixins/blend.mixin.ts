// FIXME
import type { Effect } from "@design-sdk/figma";
import type { BlendMode } from "@reflect-ui/cg";

export interface IReflectBlendMixin {
  opacity: number;
  blendMode: "PASS_THROUGH" | BlendMode;
  isMask: boolean;
  effects: ReadonlyArray<Effect>;
  effectStyleId: string;
  visible: boolean;
  radius: number;
}
