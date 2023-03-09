const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    res.send("Please provide a username and a password");
  }

  // check if user exists
  if (!isValid(username)) {
    res.send("Username taken.");
  }

  users.push({"username": username, "password": password});
  res.send("User " + username + " added.");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let promise = new Promise((resolve, reject) => {});
  promise.then(res.send(JSON.stringify(books)));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let promise = new Promise((resolve, reject) => {
    let isbn = req.params.isbn;  

    let book = books[isbn];
    
    if (!book) {
      res.send("No book was found by this isbn.");
    }
    res.send(book);
  });

  promise.then();
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let promise = new Promise((resolve, reject) => {
    let author = req.params.author;
    let filteredBooks = [];
    
    Object.keys(books).forEach(key => {
      if (books[key].author === author) {
        filteredBooks.push(books[key]);
      }
    })

    if (filteredBooks.length <= 0) {
      res.send("No books were found by this author.");
    }

    res.send(JSON.stringify(filteredBooks));
  });

  promise.then();
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let promise = new Promise((resolve, reject) => {
    let title = req.params.title;
    let filteredBooks = [];

    Object.keys(books).forEach(key => {
      if (books[key].title === title) {
        filteredBooks.push(books[key]);
      }
    })

      if (filteredBooks.length <= 0) {
        res.send("No books were found by this title.");
      }

      res.send(JSON.stringify(filteredBooks));
    });

    promise.then();
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;