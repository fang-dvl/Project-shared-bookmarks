import { incrementLikes, getLikes } from "./likes.js";

const fakeBookmarks = [
    { id: "abc", title: "Test", likes: 0 },
    { id: "xyz", title: "Other", likes: 5 },
];

test("incrementLikes increases like count by 1", () => {
    const result = incrementLikes(fakeBookmarks, "abc");
    expect(result.find(b => b.id === "abc").likes).toBe(1);
});

test("incrementLikes does not affect other bookmarks", () => {
    const result = incrementLikes(fakeBookmarks, "abc");
    expect(result.find(b => b.id === "xyz").likes).toBe(5);
});

test("incrementLikes works when likes start at a non-zero value", () => {
  const result = incrementLikes(fakeBookmarks, "xyz");
  expect(result.find((b) => b.id === "xyz").likes).toBe(6);
});

test("getLikes returns correct count", () => {
    expect(getLikes(fakeBookmarks, "xyz")).toBe(5);
});

test("getLikes returns 0 for unknown id", () => {
    expect(getLikes(fakeBookmarks, "nope")).toBe(0);
});

test("incrementLikes returns a new array (does not mutate original)", () => {
  const result = incrementLikes(fakeBookmarks, "abc");
  expect(result).not.toBe(fakeBookmarks);
  expect(fakeBookmarks.find((b) => b.id === "abc").likes).toBe(0); // original unchanged
});