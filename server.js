const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./schemas/user"); // Import the User model
const authRoutes = require("./routes/authRoutes");
const pageRoutes = require("./routes/pageRoutes");
const session = require("express-session");

const app = express();
const PORT = 8000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the directory for your views (optional, defaults to 'views' directory)
app.set('views', './views');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Configure session middleware
app.use(session({
    secret: 'schedule_moi', // Specify a secret key to sign the session ID cookie
    resave: false,
    saveUninitialized: true
}));

mongoose.connect('mongodb+srv://corpuzkim20:CharismaJARN_21@scheduleme.uzdqsq6.mongodb.net/?retryWrites=true&w=majority&appName=ScheduleMe', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to database.");
}).catch((error) => {
    console.log("Error in connecting to database:", error);
});

app.use("/", pageRoutes);
app.use("/", authRoutes);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});
