# Diff checking of the design.

## Usecase

Diff check is essential for scenarios like, pattern detection, component override extraction and so on.

### Pattern detection

- check if two or more nodes are identical, yet not set as a component - `WARNING: Nodes should be a component`

### Component-Instance override data

- check if instance has a override data

### Suggest interface

- suggest user specific property when defining a interface for component.

## Kinds of diff

- tree diff
  - structural diff
  - count diff
- property diff
- text diff
  - text characters diff
  - mixed text style diff
