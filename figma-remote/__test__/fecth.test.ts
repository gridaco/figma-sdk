import { fetch } from "../lib";

console.log("foat", process.env.FIGMA_PERSONAL_ACCESS_TOKEN);

test("valid token, invalid file", async () => {
  const resolve = async () =>
    await fetch.fetchTargetAsReflect({
      file: "",
      node: "",
      auth: {
        personalAccessToken: process.env.FIGMA_PERSONAL_ACCESS_TOKEN,
      },
    });

  expect(resolve).rejects.toThrow(fetch.NotfoundError);
});

test("valid file, invalid token for that file. (no write access)", async () => {
  const resolve = async () =>
    await fetch.fetchTargetAsReflect({
      // some file that (FIGMA_PERSONAL_ACCESS_TOKEN_ELSES) does not have write access to.
      file: "eBRgVmrNBFPuCxjULSrXkj",
      node: "520:15648",
      auth: {
        personalAccessToken: process.env.FIGMA_PERSONAL_ACCESS_TOKEN_ELSES,
      },
    });

  expect(resolve).rejects.toThrow(fetch.UnauthorizedError);
});
