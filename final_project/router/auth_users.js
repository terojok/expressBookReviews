const express = require('express');
const jwt = require('jsonwebtoken');

const books = require("./booksdb.js");

const regd_users = express.Router();

const users = [];

function isValid(value) {
    return (typeof value === 'string') && (value.trim().length > 0);
}

function authenticatedUser(username, password) {
    for (const user of users) {
        if (user.username === username) {
            if (user.password === password) {
                return true;
            }
        }
    }

    return false;
}

// Log in
regd_users.post("/login", function(req, res) {
    const username = req.body.username;
    if (!isValid(username)) {
        res.status(400).json( { message: "Missing or invalid username" } );
        return;
    }

    const password = req.body.password;
    if (!isValid(password)) {
        res.status(400).json( { message: "Missing or invalid password" } );
        return;
    }
    
    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign( { data: password }, 'access', { expiresIn: 60 * 60 } );
        req.session.authorization = { accessToken, username };
        res.json( { message: "User successfully logged in" } );
    } else {
        res.status(401).json( { message: "Invalid login - check username and password" } );
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", function (req, res) {
    const book = books[req.params.isbn];
    if (book) {
        const review = req.body.review;
        if (typeof review !== 'string') {
            res.status(400).json( { message: "Missing or invalid book review" } );
            return;
        }

        book.reviews[req.user] = review;
        res.json( { message: "Book review successfully added" } );
    } else {
        res.status(404).json( { message: "Book not found" } );
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
