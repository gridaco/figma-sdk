import type { Axis } from "@reflect-ui/core";
export function checkIfAutoLayout(node: {
  layoutMode?: Axis | "NONE" | "HORIZONTAL" | "VERTICAL";
}): boolean {
  return checkWithProps({
    layoutMode: node.layoutMode,
  });
}

// FIXME ?
// This part needs to be fixed. this may not be a correct way to detemine autolayout. -> this.layoutMode !== undefined
function checkWithProps(props: { layoutMode }): boolean {
  return props.layoutMode !== undefined;
}
