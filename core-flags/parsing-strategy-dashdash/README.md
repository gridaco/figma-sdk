# `--flag` parsing strategy

## Syntax

```
[--<key>(<=><value>)?]+
❌ key
❌ -key
❌ --key=
❌ --key==
❌ --1
👌 --key
👌 --key="="
👌 --key==1
👌 --key=value

👌 --key=value --key2
```

```ts
// "--key=value"
{
  key: "value";
}

// "--key=[1, 2]"
{
  key: [1, 2];
}

// "--one=1 --two=2"
{
  one: 1,
  two: 2
}
```
