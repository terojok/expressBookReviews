const express = require('express');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const book = books[req.params.isbn];
    if (book) {
        res.send(JSON.stringify(book, null, 4));
    } else {
        return res.status(404).json( { message: "Not found" } );
    }
});

// Get all books based on author
public_users.get('/author/:author', function (req, res) {
    const booksByAuthor = {};
    for (const [ isbn, book ] of Object.entries(books)) {
        if (book.author === req.params.author) {
            booksByAuthor[isbn] = book;
        }
    }
    res.send(JSON.stringify(booksByAuthor, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const booksByTitle = {};
    for (const [ isbn, book ] of Object.entries(books)) {
        if (book.title === req.params.title) {
            booksByTitle[isbn] = book;
        }
    }
    res.send(JSON.stringify(booksByTitle, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
