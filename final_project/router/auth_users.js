const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const hash = "SECRET_JWT";
const searchObject = require('../application/objectService.js');
const users = require("../model/users.js");

const isValid = (username) => { //returns boolean
  return users['users'].filter((user)=> {user.username === username}) !== undefined;
}

const authenticatedUser = (username, password) => {
    let foundUser = users['users'].filter((user)=> {return user.username === username});

    if (foundUser[0] && foundUser[0].password === password) {
      return true;
    }
  return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  let pwd = req.body.password
  let username = req.body.username
  if (pwd.length === 0 || username.length === 0) {
    return res.status(404).json({ message: "empty username or password" });
  }

  if (authenticatedUser(username, pwd)) {
    let accessToken = jwt.sign({ data: pwd }, hash, { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send({ message: "User logged in" })
  }

  return res.status(208).json({ message: "Invalid login. Check credentials" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let review = req.body.review
  let username = req.session.authorization.username
  let isReviewAsBeenModified = searchObject.replacePropertyInObject(books[req.params.isbn], 'username', username, 'reviews', review, 'review');
  if (!isReviewAsBeenModified) {
    let index = Object.keys(books[req.params.isbn].reviews).length
    var cumputedIndex = index !== undefined ? index : 0;
    books[req.params.isbn].reviews[cumputedIndex] = {review: review, username: username}
  }

  return res.status(200).json({ message: "review added", book: books[req.params.isbn] });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization.username
  let reviews = books[req.params.isbn]["reviews"]
  for (let key in reviews) {
    var review = reviews[key]
    if (review !== undefined && review.username === username) {
      delete books[req.params.isbn]["reviews"][key]
      return res.status(200).json({message: "review deleted", book: books[req.params.isbn]})
    }
  }
  return res.status(204).json({message: "nothing to delete"})
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.regd_users = regd_users;
