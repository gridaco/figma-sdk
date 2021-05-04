///////// README - THIS IS DEPRECATED AND WILL BE DELETED
/// the living logic lives on plugin-sdk and this will no longer be used
/// the raeson not deleting this now is cause of submodule usage and mismatching branch, after things are clean, we will remove this file.

/**
 * @deprecated Target platform this ui runs on. this gloval variable will be set on initial entry on each platform's main ui import
 */
export let TARGET_PLATFORM: TargetPlatform;

/**
 * @deprecated DO NOT USE
 * @param platform
 */
export function initializeTargetPlatform(platform: TargetPlatform) {
  TARGET_PLATFORM = platform;
  console.info(`target platform set as ${platform}`);
}

/**
 * @deprecated DO NOT USE
 */
export enum TargetPlatform {
  bridged = "xyz.bridged.bridged",
  figma = "com.figma.Desktop",
  sketch = "com.bohemiancoding.sketch3",
  xd = "xd",
  zeplin = "zeplin",
  webdev = "xyz.bridged.assistant-web-dev",
}
