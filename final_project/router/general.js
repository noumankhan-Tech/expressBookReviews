const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
    if(!isValid(username)){
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 1: Get book list
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Task 2: Get book by ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });

// Task 3: Get book by Author
public_users.get('/author/:author',function (req, res) {
  let ans = []
  for(const [key, value] of Object.entries(books)){
    if(value.author == req.params.author){
      ans.push(value);
    }
  }
  res.send(JSON.stringify(ans,null,4));
});

// Task 4: Get book by Title
public_users.get('/title/:title',function (req, res) {
  let ans = []
  for(const [key, value] of Object.entries(books)){
    if(value.title == req.params.title){
      ans.push(value);
    }
  }
  res.send(JSON.stringify(ans,null,4));
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

// Task 10: Get all books using async/await with Axios - Client side
async function getBooks() {
  try {
    let response = await axios.get('http://localhost:5000/');
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

// Task 11: Get book by ISBN using Promises
function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
     .then(response => resolve(response.data))
     .catch(error => reject(error));
  });
}

// Task 12: Get book by Author using async/await
async function getBookByAuthor(author) {
  try {
    let response = await axios.get(`http://localhost:5000/author/${author}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// Task 13: Get book by Title using async/await
async function getBookByTitle(title) {
  try {
    let response = await axios.get(`http://localhost:5000/title/${title}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

module.exports.general = public_users;
