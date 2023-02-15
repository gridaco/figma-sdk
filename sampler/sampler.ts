import fs from "fs";
import path from "path";
import { fetch } from "@design-sdk/figma-remote";
import assert from "assert";

export default async function sample({
  outdir,
  filekey,
  ids,
  auth,
}: {
  outdir: string;
  filekey: string;
  ids: string[];
  auth: {
    personalAccessToken: string;
  };
}) {
  const data = await fetchnode({
    filekey,
    ids,
    auth,
  });

  Object.keys(data).forEach((key) => {
    const node = data[key];
    const dir = path.join(outdir, filekey);
    const filename = `${key}.out.json`;
    const filepath = path.join(dir, filename);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    // write file
    fs.writeFileSync(filepath, JSON.stringify(node, null, 2));
  });
}

async function fetchnode({
  filekey,
  ids,
  auth,
}: {
  filekey: string;
  ids: string[];
  auth: {
    personalAccessToken: string;
  };
}) {
  assert(auth && auth.personalAccessToken, "auth is required");
  assert(
    !auth.personalAccessToken.startsWith("<"),
    "set your personal access token in .env"
  );
  assert(ids.length > 0, "ids is required");

  try {
    const { file, nodes } = await fetch.fetchTarget(filekey, ids, auth, {
      with_components: false,
    });
    return nodes;
  } catch (e) {
    console.error(e);
    return null;
  }
}
