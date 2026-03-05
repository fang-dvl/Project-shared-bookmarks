import { test } from "node:test";
import assert from "node:assert";
import { incrementLikes, getLikes } from "./likes.js";

const fakeBookmarks = [
  { id: "abc", title: "Test", likes: 0 },
  { id: "xyz", title: "Other", likes: 5 },
];

test("incrementLikes increases like count by 1", () => {
  const result = incrementLikes(fakeBookmarks, "abc");
  assert.strictEqual(result.find(b => b.id === "abc").likes, 1);
});

test("incrementLikes does not affect other bookmarks", () => {
  const result = incrementLikes(fakeBookmarks, "abc");
  assert.strictEqual(result.find(b => b.id === "xyz").likes, 5);
});

test("incrementLikes works when likes start at a non-zero value", () => {
  const result = incrementLikes(fakeBookmarks, "xyz");
  assert.strictEqual(result.find(b => b.id === "xyz").likes, 6);
});

test("getLikes returns correct count", () => {
  assert.strictEqual(getLikes(fakeBookmarks, "xyz"), 5);
});

test("getLikes returns 0 for unknown id", () => {
  assert.strictEqual(getLikes(fakeBookmarks, "nope"), 0);
});

test("incrementLikes does not mutate original array", () => {
  const result = incrementLikes(fakeBookmarks, "abc");
  assert.notStrictEqual(result, fakeBookmarks);
  assert.strictEqual(fakeBookmarks.find(b => b.id === "abc").likes, 0);
});