# Unique flag token parsing - Special token parsing

## Syntax

```
(__)?//@<token-name>(( )(<irrrelevant>))?
```

- 👌 `//@ignore`
- 👌 `__//@ignore`
- ❌ `_//@ignore`
- ❌ `//@unknown_token`
- ❌ `//@ignore/whatever`
- ❌ ` //@ignore`
- ❌ `Frame12 //@ignore`
- 👌 `//@ignore Frame12`
- 👌 `//@ignore /whatever`
- 👌 `//@ignore /whatever //@ignore //@ignore` - only first token will be parsed

**What is `__`?**

> Like in programming, some design tools such as figma supports internal component with prefix `__`. Using special tokens on component is a valid scenario, as also exporting them or using them internally. For this reason, we take prefix `__` as a valid input. P.s. only special token requires to be `starts with`, you can understand this as that every other flags containing name supports `__` prefix.
