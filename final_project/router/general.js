const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);

    // Check if a user with the given username already exists
    const doesExist = (username) => {
        // Filter the users array for any user with the same username
        let userswithsamename = users.filter((user) => {
            return user.username === username;
        });
        // Return true if any user with the same username is found, otherwise false
        if (userswithsamename.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    // Check if both username and password are provided
    if (username && password) {
        console.log(users);
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Retrieve the isbn parameter from the request URL and send the corresponding book's details
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book) {
        // Send error message if no book found
        return res.status(404).json({ message: "Unable to find the book with the ISBN " + isbn + "!" });
    }
    res.send(book);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Retrieve the author parameter from the request URL and send the corresponding books' details
    const author = req.params.author;
    // Get all the values in the dictionary
    let books_details = Object.keys(books).map(function(key){
        return books[key];
    });
    // Filter the books details array to find books whose author matches the extracted author parameter
    let filtered_books_details = books_details.filter((book) => book.author === author);
    if (!filtered_books_details.length) {
        // Send error message if no book found
        return res.status(404).json({ message: "No book found for the author \"" + author + "\"!" });
    }
    // Send the filtered_books_details array as the response to the client
    res.send(filtered_books_details);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Retrieve the title parameter from the request URL and send the corresponding books' details
    const title = req.params.title;
    // Get all the values in the dictionary
    let books_details = Object.keys(books).map(function(key){
        return books[key];
    });
    // Filter the books details array to find books whose title matches the extracted title parameter
    let filtered_books_details = books_details.filter((book) => book.title === title);
    if (!filtered_books_details.length) {
        // Send error message if no book found
        return res.status(404).json({ message: "No book found for the title \"" + title + "\"!" });
    }
    // Send the filtered_books array as the response to the client
    res.send(filtered_books_details);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Retrieve the isbn parameter from the request URL and send the corresponding book's details
    const isbn = req.params.isbn;
    console.log(isbn)
    const book = books[isbn]
    console.log(book)
    const reviews = book.reviews;
    console.log(reviews)
    if (!reviews) {
        // Send error message if no review found
        return res.status(404).json({ message: "No review found for the book with the ISBN " + isbn + "!" });
    }
    res.send(reviews);
});

module.exports.general = public_users;
