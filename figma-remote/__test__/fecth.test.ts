import { fetch } from "../lib";

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

test("expired token, valid file", async () => {
  // Define the async function that iterates over the generator
  const iterateGenerator = async () => {
    const iter = fetch.fetchFile({
      file: "eBRgVmrNBFPuCxjULSrXkj",
      auth: {
        personalAccessToken: process.env.FIGMA_PERSONAL_ACCESS_TOKEN_EXPIRED,
      },
    });

    // Iterate over the generator and await each result
    for await (const _ of iter) {
      // Normally process each value here, but we're expecting an error
    }
  };

  // Assert that iterating over the generator throws an UnauthorizedError
  await expect(iterateGenerator()).rejects.toThrow(
    fetch.TokenExpiredUnauthorizedError
  );
});
