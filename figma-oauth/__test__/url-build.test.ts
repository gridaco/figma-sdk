import { oauthBrowserUrl, oauthTokenRequestUrl } from "../";

test("oauth link building with params", () => {
  expect(
    oauthBrowserUrl({
      client_id: "USz3HnKVO6Y2HUED98ZEzf",
      redirect_uri: "https://accounts.grida.co/callback/figma-app-oauth",
      state: "",
    }),
  ).toBe(
    "https://www.figma.com/oauth?client_id=USz3HnKVO6Y2HUED98ZEzf&redirect_uri=https%3A%2F%2Faccounts.grida.co%2Fcallback%2Ffigma-app-oauth&scope=file_read&state=&response_type=code",
  );
});

test("oauth token request url building with params", () => {
  expect(
    oauthTokenRequestUrl({
      client_id: "USz3HnKVO6Y2HUED98ZEzf",
      client_secret: "pk4D9pwAMWqvOHCI8oor", // this is dummy client sefret - no worry
      redirect_uri: "https://accounts.grida.co/callback/figma-app-oauth",
      code: "r5RpCppGRwFpflPZ0suP9xRRu", // code generated from previous browser auth. (this is also a dummy code)
    }),
  ).toBe(
    "https://www.figma.com/api/oauth/token?client_id=USz3HnKVO6Y2HUED98ZEzf&client_secret=pk4D9pwAMWqvOHCI8oor&grant_type=authorization_code&redirect_uri=https%3A%2F%2Faccounts.grida.co%2Fcallback%2Ffigma-app-oauth&code=r5RpCppGRwFpflPZ0suP9xRRu",
  );
});
