import { parse as __parse, Option } from "./dashdash";

type FlagLike = `--${string}` | `--${string}=${string}`;

export function parse(
  args: string | FlagLike[],
  options?: Array<Option> | undefined,
  env?: { [key: string]: string } | undefined
) {
  const argv: FlagLike[] = Array.isArray(args)
    ? args
    : (args.split(" ") as FlagLike[]);
  // the dashdash parser is designed for cli use, the argv takes [0] path [1] file [2...] as args.
  const _default_args = ["", ""];
  const res = __parse({
    //argv,
    argv: _default_args.concat(argv),
    slice: 2, // issue: setting slice to 0 still won't work. using the default value - ref - https://github.com/trentm/node-dashdash/issues/40#issuecomment-936888964
    env: env ?? {},
    options: options ?? accept_all(argv),
  });

  // remove _args field
  const sanitized: any = res;
  delete sanitized._args;
  sanitized._order = res._order.map((f) => f.key);

  // return sanitized
  return res;
}

function accept_all(
  flags: `--${string}`[]
): { name: string; type: "string" | "bool" }[] {
  return flags.map((f) => {
    return {
      name: f.match(/--([A-Za-z0-9\-\_]+)/g)[0].split("--")[1],
      type: f.includes("=") ? "string" : "bool",
    };
  });
}
