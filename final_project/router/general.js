const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
var users = require("../model/users.js");
const public_users = express.Router();
const searchObject = require('../application/objectService.js');


public_users.post("/register", (req,res) => {
  let pwd = req.body.password
  let username = req.body.username
  if (pwd.length === 0 || username.length === 0){
    return res.status(500).json({message: "empty username or password"})
  }

    let userFound =  users['users'].filter((user)=> { return user.username === username});
    if (userFound.length > 0) {
      return res.status(500).json({message: "user already exists"})
    }


  users['users'].push({username : username, password : pwd});
  return res.status(200).json({message: "User registered"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let booksPromise = new Promise((res, rej) => {
    res(JSON.stringify(books))
  });

  booksPromise.then((books) =>{
    return res.status(200).json(books);
  });

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let bookPromise = new Promise((res, rej) => {
    let book = books[req.params.isbn];
    if (book === undefined) {
      return rej("Book not found");
    }

    res(JSON.stringify(book))
  });

  bookPromise.then(
    (book) => {return res.status(200).json(JSON.stringify(book))},
    (rejMessage) => {return res.status(404).json({message: rejMessage})}
  );
})
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let bookPromise = new Promise((res, rej) => {
    let booksFound = searchObject.searchObject(books, "author", author)
    if (booksFound.length === 0) {
      return rej("book not found")
    }

    res(JSON.stringify(booksFound))
  });

  bookPromise.then(
    (books) => {return res.status(200).json(JSON.stringify(books))},
    (rejMessage) => {return res.status(404).json({message: rejMessage})}
  );
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let bookPromise = new Promise((res, rej) => {
    let booksFound = searchObject.searchObject(books, "title", title)
    if (booksFound.length === 0) {
      return rej("book not found")
    }

    res(JSON.stringify(booksFound))
  });

  bookPromise.then(
    (books) => {return res.status(200).json(JSON.stringify(books))},
    (rejMessage) => {return res.status(404).json({message: rejMessage})}
  );
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let book = books[req.params.isbn];
  if (book === undefined) {
    return res.status(404).json({message: "Book not found"});
  }

  return res.status(200).json(JSON.stringify(book));
});

module.exports.general = public_users;
