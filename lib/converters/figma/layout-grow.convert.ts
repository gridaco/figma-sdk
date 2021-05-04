export function convertLayoutGrowToReflect(layoutGrow: number) {
  if (layoutGrow === 0) {
    return "FIXED";
  } else if (layoutGrow === 1) {
    return "STRETCH";
  } else {
    console.error(
      "not handled figma api is updated. layout grow value not supported : ",
      layoutGrow
    );
  }
}
