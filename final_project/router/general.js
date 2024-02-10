const express = require('express');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

function isNonEmptyString(value) {
    return (typeof value === 'string') && (value.trim().length > 0);
}

public_users.post("/register", function (req, res) {
    const username = req.body.username;
    if (!isNonEmptyString(username)) {
        res.status(400).json( { message: "Missing or invalid username" } );
        return;
    }

    const password = req.body.password;
    if (!isNonEmptyString(password)) {
        res.status(400).json( { message: "Missing or invalid password" } );
        return;
    }

    for (const user of users) {
        if (user.username === username) {
            res.status(409).json( { message: "User already exists" } );
            return;    
        }
    }

    users.push( { "username": username, "password": password } );
    res.json( { message: "User successfully registered" } );
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    const getBookList = function () {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(books);
            }, 200);
        } );
    };

    try {
        const bookList = await getBookList();
        res.send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        res.status(error.status).json( { message: error.message } );
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const getBookByISBN = function (isbn) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const book = books[isbn];
                if (book) {
                    resolve(book);
                } else {
                    reject( { status: 404, message: "Book not found" } );
                }
            }, 200);
        } );
    };

    try {
        const book = await getBookByISBN(req.params.isbn);
        res.send(JSON.stringify(book, null, 4));
    } catch (error) {
        res.status(error.status).json( { message: error.message } );
    }
});

// Get all books based on author
public_users.get('/author/:author', async function (req, res) {
    const getBooksByAuthor = function (author) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const booksByAuthor = {};
                for (const [ isbn, book ] of Object.entries(books)) {
                    if (book.author === author) {
                        booksByAuthor[isbn] = book;
                    }
                }
                resolve(booksByAuthor);
            }, 200);
        } );
    };

    try {
        const booksByAuthor = await getBooksByAuthor(req.params.author);
        res.send(JSON.stringify(booksByAuthor, null, 4));
    } catch (error) {
        res.status(error.status).json( { message: error.message } );
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const getBooksByTitle = function (title) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const booksByTitle = {};
                for (const [ isbn, book ] of Object.entries(books)) {
                    if (book.title === title) {
                        booksByTitle[isbn] = book;
                    }
                }
                resolve(booksByTitle);
            }, 200);
        } );
    };

    try {
        const booksByTitle = await getBooksByTitle(req.params.title);
        res.send(JSON.stringify(booksByTitle, null, 4));
    } catch (error) {
        res.status(error.status).json( { message: error.message } );
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const book = books[req.params.isbn];
    if (book) {
        res.send(JSON.stringify(book.reviews, null, 4));
    } else {
        res.status(404).json( { message: "Book not found" } );
    }
});

module.exports.general = public_users;
