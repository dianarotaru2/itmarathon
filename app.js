const mysql = require('mysql2');
const express = require('express');
const session = require('express-session');
const ejs = require("ejs");
const bodyParser = require("body-parser");
const path = require('path');



const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'users'
});

connection.connect();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.render("home");
})

app.get("/report", function (req, res) {
    res.render("report");
});

app.get("/signIn", function (req, res) {
    res.sendFile(__dirname + "/views/signIn.html");
});
app.get("/register", function (req, res) {
    res.sendFile(__dirname + "/views/register.html");
});
app.get("/aboutUs", function (req, res) {
    res.render("aboutUs");
})
app.get("/contact", function (req, res) {
    res.render("viewReports", {
        
        posts: posts
    });
});

/* LOGIN */
app.post('/signIn', function (request,response) {
    // Capture the input fields
    let username = request.body.username;
    let password = request.body.password;
    // Ensure the input fields exists and are not empty
    if (username && password) {
        // Execute SQL query that'll select the account from the database based on the specified username and password
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) {
                throw error;
            }
            // If the account exists
            if (results.length > 0) {
                // Authenticate the user
                request.session.loggedin = true;
                request.session.username = username;
                // Redirect to home page
                response.redirect('/homeSign');
            } else {
                response.redirect('/failure');
            }
            response.end();
        });
    } else {
        response.redirect('/signIn');
        response.end();
    }
});

app.get('/failure', function (req, res) {
    res.sendFile(__dirname + "/views/failure.html");
});

app.get('/homeSign', function (request, response) {
    // If the user is loggedin
    if (request.session.loggedin) {
        // Output username
        response.redirect('/');
    } else {
        // Not logged in
        response.send('Please login to view this page!');
    }
    response.end();
});


/* Register */

app.post('/register', function (request, response) {
    let username = request.body.username;
    let password = request.body.password;
    let email = request.body.email;
    // Ensure the input fields exists and are not empty
    if (username && password && email) {
        // Execute SQL query that'll select the account from the database based on the specified username and password
        connection.query("INSERT INTO accounts (username, password, email) VALUES ('" + username + "' , " + "'" + password + "' ," + "'" + email + "')", function (error, fields) {
            // If there is an issue with the query, output the error
            /*if (error) {
            throw error;
        } 
            // If the account exists
            console.log(results.length);
            if (results.length > 0) {
            // Authenticate the user
            */
            request.session.loggedin = true;
            request.session.username = username;
            // Redirect to home page
            
            response.redirect('/homeRegister');
        });
       
    }
});
   
app.get('/homeRegister', function (request, response) {
    // If the user is loggedin
    if (request.session.loggedin) {
        // Output username
        response.redirect('/signIn');
    } else {
        // Not logged in
        response.send('Please login to view this page!');
    }
    response.end();
});

/* Reports */
let posts = [];

app.post('/report', function (request, response) {
    const post = {
        cathegory: request.body.name,
        location: request.body.location,
        content: request.body.postOther
    }

    posts.push(post);

    response.redirect("/contact");
});



app.listen(3000, function () {
    console.log("Serverul a fost deschis");
})


