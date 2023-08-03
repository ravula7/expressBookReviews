const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
        const isbn = req.params.isbn;
        let filtered_book = books[isbn]
        if (filtered_book) {
            let review = req.query.review;
            let reviewer = req.session.authorization['username'];
            if(review) {
                filtered_book['reviews'][reviewer] = review;
                books[isbn] = filtered_book;
            }
            res.send(`The review for the book with ISBN  ${isbn} has been added/updated.`);
        }
        else{
            res.send("Unable to find this ISBN!");
        }
      });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
