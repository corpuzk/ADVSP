const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../schemas/user");

const router = express.Router();

//User registration page
router.post("/sign_up", async (req, res) => {
    //Variables that store User inputs from registration page
    var company = req.body.company;
    var first = req.body.first;
    var last = req.body.last;
    var user = req.body.user;
    var pass = req.body.pass;
    var confirm_pass = req.body.confirm_pass;
    var isAdmin = req.body.admin ? true : false; //Checkbox boolean that dictates if the User is an Admin or not

    try {
        if (pass !== confirm_pass) { //Checks to make sure password and confirmed password match
            return res.status(400).send("Passwords do not match.");
        }

        const hashedPassword = await bcrypt.hash(pass, 10); //Hashes password

        //Instantiates new User object
        const newUser = new User({
            company: company,
            first: first,
            last: last,
            user: user,
            pass: hashedPassword, //Hashed password is stored instead of raw password for security
            isAdmin: isAdmin //Stores Admin boolean for each User
        });

        await newUser.save(); //Saves new User object to database

        console.log("Record inserted successfully.");
        console.log("isAdmin value:", isAdmin); //Console check for Admin boolean value
        return res.redirect('login.html'); //Redirects User to login page after successful registration
    } catch (error) {
        console.error("Error inserting record:", error);
        return res.status(500).send("Internal server error"); //Tracing insertion errors
    }
});

//User login page
router.post("/login", async (req, res) => {

    const { company, user, pass } = req.body; //User inputs login credentials

    try {
        const foundUser = await User.findOne({ company: company, user: user }); //Validate User information from database

        if (!foundUser) {
            return res.status(401).send("User not found."); //Incorrect User login credentials (username)
        }

        const isAdmin = foundUser.isAdmin; //Administrative User?

        const allUsers = await User.find({ company: company }, 'first last'); //Fetch all User objects from the same company (first and last names only)

        //Render calendar page
        return res.render('calendar', {
            firstName: foundUser.first,
            lastName: foundUser.last,
            company: foundUser.company,
            allUsers: allUsers, //Send User objects from the company to the calendar
            isAdmin: isAdmin, //Send User admin boolean to calendar
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).send("Internal server error"); //Handle and traceback login errors
    }
});


//User account page and availability form
router.get("/account", async (req, res) => {
    try {
        const user = req.user; // Placeholder for user ID or username
        const first = req.query.first; // Placeholder for first name
        const last = req.query.last; // Placeholder for last name
        const company = req.query.company; // Placeholder for company name
        const isAdmin = req.query.isAdmin; // Placeholder for isAdmin flag

        const foundUser = await User.findOne({ user, first, last, company, isAdmin });

        if (!foundUser) {
            return res.status(404).send("User not found.");
        }

        return res.render('account', {
            username: foundUser.user,
            firstName: foundUser.first,
            lastName: foundUser.last,
            company: foundUser.company,
            isAdmin: foundUser.isAdmin
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).send("Internal server error");
    }
});

//User presses log out button
router.get("/logout", (req, res) => {
    req.session.destroy((err) => { //Existing session is ended and User is logged out
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).send("Internal server error");
        }
        res.redirect("/login.html"); //Redirects User to login page
    });
});

module.exports = router;