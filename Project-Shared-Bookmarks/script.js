// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIds } from "./storage.js";
import { setData, clearData } from "./storage.js";

window.onload = function () {
  const users = getUserIds();
  // document.querySelector("body").innerText = `There are ${users.length} users`;
};

let bookList=[];
const title = document.getElementById("title");
const url = document.getElementById("url");
const description = document.getElementById("description");

//check the right input and if its ok -> add to the bookList
window.submit=function () {
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
    let timeStamp = new Date().toLocaleString()
    let likes=0;
    let bookmark = new Book(title.value, url.value, description.value, timeStamp, likes);
    bookList.push(bookmark);
    setData(bookList);
    render();
  }
}

function Book(title, url, description,timeStamp,likes) {
  this.title = title;
  this.url = url;
  this.description = description;
  this.timeStamp = timeStamp;
  this.likes = likes;
}

function render() {
  let bookMarkTable = document.querySelector(".bookMarkTable");
  let rowsNumber = bookMarkTable.rows.length;
  //delete old table
  for (let n = rowsNumber - 1; n > 0; n--)
   { bookMarkTable.deleteRow(n);}
  
  //insert updated row and cells
  bookList.forEach((bookmark,index) => {
    let row = bookMarkTable.insertRow(index);
    row.insertCell(0).innerHTML = `<a href="${bookmark.url}">${bookmark.title}</a>`;
    row.insertCell(1).innerHTML = bookmark.description;
    row.insertCell(2).innerHTML = bookmark.timeStamp;
    row.insertCell(3).innerHTML = `<button class="btn btn-primary">Like</button> ${bookmark.likes}`;
  } )
}