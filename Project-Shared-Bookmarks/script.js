// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { clearData, getData, getUserIds, setData } from "./storage.js";
import { incrementLikes } from "./likes.js";
import { copyToClipboard } from "./clipboard.js";

let currentUser = null;

function userIdSelect(users) {
  let selectUsers = document.getElementById("user-select");
  let optionUserId = document.createElement("option");
  optionUserId.textContent = "select";
  selectUsers.append(optionUserId);

  users.forEach((id, index) => {
    optionUserId = document.createElement("option");
    document.querySelectorAll("option")[index].classList.add("userOption");
    optionUserId.textContent = `User ${id}`;
    optionUserId.value = id;
    selectUsers.append(optionUserId);
  });
}

function bookmarkSelector() {
  const selectUsers = document.getElementById("user-select");

  selectUsers.addEventListener("change", (event) => {
    currentUser = event.target.value;
    const bookmarkCard = document.getElementById("bookmark-list");

    bookmarkCard.innerHTML = null;

    let bookmarkData;
    try {
      bookmarkData = getData(event.target.value) || []; // Getting data from localStorage for the user with selected user ID (captured in change event)

      bookmarkData.sort((a, b) => b.timestamp - a.timestamp); //Sorting All bookmarks in reverse chronological order

      // Filtering out valid bookmarks of the user having complete data to show
      bookmarkData = bookmarkData.filter((obj) => {
        let requiredFields = [
          "url",
          "title",
          "description",
          "timestamp",
        ];

        // checking if all fields in the obj of the user have right data
        let isValidObj = requiredFields.every(
          (field) =>
            obj[field] !== undefined && obj[field] != null && obj[field] !== "",
        ) && obj.likes !== undefined;

        //returning true / false based on if the fields have the right data in the obj. If true, obj remains in bookMarkData else removed.
        return isValidObj;
      });
      // Show empty state message if no valid bookmarks
      if (bookmarkData.length === 0) {
        bookmarkCard.textContent = "This user has no bookmarks";
        return;
      }

      //Time to display All valid bookmarks of the user
      for (let i = 0; i < bookmarkData.length; i++) {
        //Creating elements for displaying bookmarks
        let title = document.createElement("h3");
        let description = document.createElement("p");
        let url = document.createElement("a");
        url.append(title);
        let timestamp = document.createElement("p");
        let likeBtn = document.createElement("button");
        let hrTag = document.createElement("hr");

        //Adding CSS class to the elements for displaying bookmarks
        title.classList.add("title");
        description.classList.add("description");
        url.classList.add("url");
        timestamp.classList.add("timestamp");
        likeBtn.classList.add("likeBtn");

        //Assigning textContent to the HTML elements with the bookmark data of the user
        url.href = bookmarkData[i].url;
        title.textContent = bookmarkData[i].title;
        description.textContent = bookmarkData[i].description;
        timestamp.innerHTML = new Date(
          bookmarkData[i].timestamp,
        ).toLocaleString();
        //like button wired to incrementlikes + persist
        const bookmarkId = bookmarkData[i].id;
        likeBtn.textContent = `${bookmarkData[i].likes} Likes`;
        likeBtn.setAttribute("aria-label", `Like ${bookmarkData[i].title}, current likes: ${bookmarkData[i].likes}`);
        likeBtn.addEventListener("click", () => {
          let all = getData(currentUser) || [];
          all = incrementLikes(all, bookmarkId);
          setData(currentUser, all);
          selectUsers.dispatchEvent(new Event("change"));
        });
        // conpy button
        const copyBtn = document.createElement("button");
        copyBtn.textContent = "Copy URL";
        copyBtn.classList.add("copyBtn");
        copyBtn.setAttribute("aria-label", `Copy URL for ${bookmarkData[i].title}`);
        copyBtn.addEventListener("click", async () => {
          await copyToClipboard(bookmarkData[i].url);
          copyBtn.textContent = "Copied!";
          setTimeout(() => (copyBtn.textContent = "Copy URL"), 2000);
        });

        //Appending all HTML elements containing bookmark data of the user to the div tag
        bookmarkCard.append(url, description, timestamp, likeBtn, copyBtn, hrTag);
      }
    } catch (err) {
      bookmarkCard.textContent = "This user has no bookmarks";
    }
  });
}

let bookList = [];
const title = document.getElementById("title");
const url = document.getElementById("url");
const description = document.getElementById("description");

function addBookmark() {
  if (
    title.value == null ||
    url.value == "" ||
    description.value == null ||
    description.value == ""
  ) {
    alert("Please fill all fields!");
    return false;
  } else {
    try {
      new URL(url.value);
    } catch (e) {
      alert("Invalid URL!");
      return false;
    }

    if (!currentUser) {
      alert("Please select a user first!");
      return false;
    }

    // load existing bookmarks for this user first
    try {
      bookList = getData(currentUser) || [];
    } catch {
      bookList = [];
    }

    let bookmark = new Book(title.value, url.value, description.value);
    bookList.push(bookmark);
    setData(currentUser, bookList); // fixed: pass currentUser

    // clear inputs
    title.value = "";
    url.value = "";
    description.value = "";

    // refresh display by re-triggering Diksha's change event
    document
      .getElementById("user-select")
      .dispatchEvent(new Event("change"));
  }
}

function Book(titleVal, urlVal, descriptionVal) {
  this.id = crypto.randomUUID();          // needed for likes
  this.title = titleVal;
  this.url = urlVal;
  this.description = descriptionVal;
  this.timestamp = Date.now();            // number so Diksha's sort works
  this.likes = 0;
}


window.onload = function () {
  const users = getUserIds();
  userIdSelect(users);
  bookmarkSelector();
  document.getElementById("submit-btn").addEventListener("click", addBookmark);
};
