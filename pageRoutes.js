const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('login.html');
});

//Send calendar.ejs to client
router.get("/calendar", (req, res) => {
    res.sendFile(__dirname + "/calendar.ejs");
});

module.exports = router;
