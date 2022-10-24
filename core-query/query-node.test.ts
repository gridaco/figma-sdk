import {
  getNodeByIdFrom,
  getNodeAndRootByIdFrom,
  document,
} from "./query-node";

const a = {
  id: "A",
  children: [
    {
      id: "a1",
    },
    {
      id: "a2",
    },
  ],
};

const b = {
  id: "B",
  children: [
    {
      id: "b1",
    },
    {
      id: "b2",
      children: [
        {
          id: "b2-1",

          children: [
            {
              id: "b2-1-1",
            },
          ],
        },
      ],
    },
  ],
};

const c = {
  id: "C",
  children: [
    {
      id: "c1",
    },
  ],
};

const page = [a, b, c];

test("find nested item under node", () => {
  expect(getNodeByIdFrom("b2-1-1", b).id).toBe("b2-1-1");
});

test("find the root of the target under the page nodes by target's id", () => {
  const { node, root } = getNodeAndRootByIdFrom("b2-1-1", page);
  expect(root.id).toBe("B");
  expect(node.id).toBe("b2-1-1");
});

test("builder pattern #1", () => {
  const doc = document(page);
  const node = doc.getNodeById("b2-1-1");
  expect(node.id).toBe("b2-1-1");
});

test("builder pattern #2", () => {
  const doc = document(a);
  const node = doc.getNodeById("b2-1-1");
  expect(node).toBe(null);
});
