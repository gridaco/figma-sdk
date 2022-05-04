import { createParser, Option, Results } from "./dashdash";

export type { Option, Results };

type FlagLike = `--${string}` | `--${string}=${string}`;

export function parse(
  args: string | FlagLike[],
  options?: Array<Option> | undefined,
  env?: { [key: string]: string } | undefined
) {
  const argv: FlagLike[] = Array.isArray(args)
    ? args
    : (args.split(" ") as FlagLike[]);

  options = options ?? accept_all(argv);

  // the dashdash parser is designed for cli use, the argv takes [0] path [1] file [2...] as args.
  const _default_args = ["", ""];

  const __parser = createParser({
    options: options,
    allowUnknown: true,
  });

  const res = __parser.parse({
    //argv,
    argv: _default_args.concat(argv),
    slice: 2, // issue: setting slice to 0 still won't work. using the default value - ref - https://github.com/trentm/node-dashdash/issues/40#issuecomment-936888964
    env: env ?? {},
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
  const res = flags.map((f) => {
    if (f.includes("--")) {
      return {
        name: f.match(/--([A-Za-z0-9\-\_]+)/g)[0].split("--")[1],
        type: f.includes("=") ? "string" : "bool",
      };
    }
    return false;
  });
  return res.filter(Boolean) as { name: string; type: "string" | "bool" }[];
}
