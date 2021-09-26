# Vector diff

## Usecase

### Shape similarity

Checks if vector is visually similar (without using cv)

### Same path with variants (color / scale / w / h / etc..)

Checks if vector is the same path, but with a different post-effective attributes such like color and scale.

## References

- [svgjs](https://svgjs.dev/docs/3.0/)
- [diffsvg (python / archived)](https://github.com/jrsmith3/diffsvg)
- [svg path editor](https://github.com/yqnn/svg-path-editor) ([site](https://yqnn.github.io/svg-path-editor/))
- [svgo](https://github.com/svg/svgo) / [svgomg](https://jakearchibald.github.io/svgomg/)
- [existing-tools-attempts-for-diffing-svg](https://discourse.opensourcedesign.net/t/existing-tools-attempts-for-diffing-svg/763)
- [mdn - svg path commands](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#path_commands)

**Example of svgo flattening**

original

```xml
<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/><path d="M3,3v18h18V3H3z M14,17H7v-2h7V17z M17,13H7v-2h10V13z M17,9H7V7h10V9z"/></g></svg>
```

minimized

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
  <path fill="none" d="M0 0h24v24H0z"/>
  <path d="M3 3v18h18V3H3zm11 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
</svg>
```
