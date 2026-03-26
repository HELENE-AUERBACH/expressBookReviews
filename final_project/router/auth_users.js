const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // check if username and password match the one we have in records.
    console.log(users);
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    console.log(username);
    const password = req.body.password;
    console.log(password);

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        console.log(req.session.authorization);
        return res.status(200).send(`User ${req.session.authorization.username} successfully logged in`);
    } else {
        return res.status(404).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Retrieve the isbn parameter from the request URL and find the corresponding book's details
    const isbn = req.params.isbn;
    console.log(isbn);
    const book = books[isbn];
    console.log(book);
    if (!book) {
        // Send error message if no book found
        return res.status(404).json({ message: "Unable to find book with the ISBN ${isbn}!" });
    }

    // Retrieve username in session
    const username = req.session.authorization.username;
    console.log(username);
    if (!username) {
        // Send error message if no username found
        return res.status(404).json({ message: "Unable to find username in session!" });
    }

    // Retrieve the review query parameter
    const review = req.query.review;
    console.log(review);
    if (review) {
        let book_reviews = book.reviews;
        console.log(book_reviews);
        let user_review = book_reviews[username];
        console.log(user_review);
        if (!user_review) {
            book_reviews[username] = review;
            // Send success message indicating the review has been added
            res.send(`Review of user ${username} for the ISBN ${isbn} added.`);
        } else {
            // Send success message indicating the review has been updated
            res.send(`Review of user ${username} for the ISBN ${isbn} updated.`);
        }
    } else {
        // Send error message if no review was provided as a request query
        return res.status(422).json({ message: "None review was provided as a request query!" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
