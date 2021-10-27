# flags on layer name or in meta data

- ignore - indicating layer that should be ignored
- base component - indicating base layer that having nested component structure for state (variant) representation on design tools.
- content component - component(symbol) that is only marked as component because it contains re-usable content, not for marking that it is a component with specific layout or style.
- data source - layer / instance that is only existing for holding a specific data that can be referenced by other nodes.
- data target - for mapping the single data to be targetted from data source (can be another node, or remote api with structured data)

## `--flags` flag args

> `--flag` is a standard way for passing arguments in cli environments across various ecosystems.

using `dashdash flag` (as we call it) is usefull for passing development related arguments and passing countinuous arguments.

## `//@special` tokens

> The syntax is inspired from typescript's `//@ts-ignore`

The list of special tokens [can be found here](./@special/README.md).

## `(value)` tokens

for passing dedicated arguments in design tools, the most intuitive way is to inject the minimal data throught the layer's name. And we often use `()` to descrive the design's state.

Inspired from this, we also support `(value)` flags by deafult. In this way, we can keep the layer names human readable & managable.
