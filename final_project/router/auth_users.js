const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // check is the username is valid
  let usernameValid = users.filter(user => user.username === username);
  return usernameValid.length == 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // check if username and password match the one we have in records.
  let validUser = users.filter(user => user.username === username && user.password === password);
  return validUser.length > 0;
}

// only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  // check that username and password are provided
  if(!username || !password) {
    return res.send("Please provide a username and a password");
  }

  // check if registered
  if(!authenticatedUser(username, password)) {
    return res.send("Please enter valid username and password");
  }

  // login
  let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60*60});

  req.session.authorization = {accessToken, username};

  return res.send("User " + username + " logged in.");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;

  let filteredBooks = books[isbn];

  if (filteredBooks.length <= 0) {
    return res.send("Please provide valid isbn.");
  }

  filteredBooks.reviews[req.session.authorization.username] = req.query.review;
  res.send(req.session.authorization.username  + " added a review of book " + isbn+ ".");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let filteredBooks = books[isbn];

  if (filteredBooks.length <= 0) {
    return res.send("Please provide valid isbn");
  }

  delete filteredBooks.reviews[req.session.authorization.username];
  res.send("Review of book " + isbn + " by " + req.session.authorization.username + " deleted.");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;