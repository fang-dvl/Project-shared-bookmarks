export function incrementLikes(bookmarks, bookmarkId) {
    return bookmarks.map(b =>
        b.id === bookmarkId ? { ...b, likes: b.likes + 1} : b
    );
}

export function getLikes(bookmarks, bookmarkId) {
    const bookmark = bookmarks.find(b => b.id === bookmarkId);
    return bookmark ? bookmark.likes : 0;
}