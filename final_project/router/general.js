const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
 });

public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let filtered_books = {};
  for(let key in books){
    if(books[key].author === author){
        filtered_books[key] = books[key];
    }
  }
  return res.status(200).json(filtered_books);
});

public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let filtered_books = {};
  for(let key in books){
    if(books[key].title === title){
        filtered_books[key] = books[key];
    }
  }
  return res.status(200).json(filtered_books);
});

public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

// Task 10 - async-await
async function getAllBooks() {
  const response = await axios.get('http://localhost:5000/');
  return response.data;
}

// Task 11 - Promise
function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`).then(res => resolve(res.data)).catch(err => reject(err));
  });
}

// Task 12 - async-await author
async function getBookByAuthor(author) {
  const response = await axios.get(`http://localhost:5000/author/${author}`);
  return response.data;
}

// Task 13 - async-await title
async function getBookByTitle(title) {
  const response = await axios.get(`http://localhost:5000/title/${title}`);
  return response.data;
}

module.exports.general = public_users;
