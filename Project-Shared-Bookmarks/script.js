// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { clearData, getData, getUserIds, setData } from "./storage.js";

function userIdSelect(users) {
  let selectUsers = document.getElementById("user-select");
  let optionUserId = document.createElement("option");
  optionUserId.textContent = "select";
  selectUsers.append(optionUserId);

  users.forEach((id, index) => {
    optionUserId = document.createElement("option");
    document.querySelectorAll("option")[index].classList.add("userOption");
    optionUserId.textContent = id;
    optionUserId.value = id;
    selectUsers.append(optionUserId);
  });
}

function bookmarkSelector() {
  const selectUsers = document.getElementById("user-select");

  selectUsers.addEventListener("change", (event) => {
    const bookmarkCard = document.getElementById("bookmark-list");

    bookmarkCard.innerHTML = null;

    let bookmarkData;
    try {
      bookmarkData = getData(event.target.value); // Getting data from localStorage for the user with selected user ID (captured in change event)

      bookmarkData.sort((a, b) => b.timestamp - a.timestamp); //Sorting All bookmarks in reverse chronological order

      // Filtering out valid bookmarks of the user having complete data to show
      bookmarkData = bookmarkData.filter((obj) => {
        let requiredFields = [
          "url",
          "title",
          "description",
          "timestamp",
          "likes",
        ];

        // checking if all fields in the obj of the user have right data
        let isValidObj = requiredFields.every(
          (field) =>
            obj[field] != undefined && obj[field] != null && obj[field] != "",
        );

        //returning true / false based on if the fields have the right data in the obj. If true, obj remains in bookMarkData else removed.
        return isValidObj;
      });

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
        likeBtn.textContent = `${bookmarkData[i].likes} Likes`;

        //Appending all HTML elements containing bookmark data of the user to the div tag
        bookmarkCard.append(url, description, timestamp, likeBtn, hrTag);
      }
    } catch (err) {
      bookmarkCard.textContent = "This user has no bookmarks";
    }
  });
}

window.onload = function () {
  const users = getUserIds();
  userIdSelect(users);
  bookmarkSelector();
};
