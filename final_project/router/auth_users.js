const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//write code to check is the username is validconst validuser = users.filter((user) =>{

const isValid = (username)=>{
    let userwithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userwithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}
/*const isValid = (username)=>{ //returns boolean
    for (var user in users) {
      if (user["username"]===username) {
          return true;
      }
  }
    return false;
}
/*const isValid = (username)=>{ //returns boolean
    const usersLength = users.length;
    for(let i = 0; i < usersLength; i++) {
        if(users[i].username == username){
            return false;
        }
    }
    return true;
}*/

const authenticatedUser = (username,password)=>{
    let validUser = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validUser.length > 0){
      return true;
    } else {
      return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            {data: password,},
            "access",
            { expiresIn: 60 * 60 }
        );
        req.session.authorization = {
            accessToken,
            username,
        };
        return res.status(200).send("User successfully logged in");
    } else {
        return res
            .status(208)
            .json({ message: "Invalid Login. Check username and password" });
    }
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
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let username = req.session.authorization['username'];
    let filtered_book = books[isbn];

    if (filtered_book) {
        delete filtered_book.reviews[username];
        return res.status(200).json("Review deleted.");
    }
    return res.status(404).json({ message: "Invalid ISBN" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
