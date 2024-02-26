let express = require('express');
let app = express();
let bodyParser = require('body-parser')
require('dotenv').config();




// Mounts the middleware for parsing the body of HTTP requests.
app.use(bodyParser.urlencoded({extended: false}));


// Logs requests with method, path and ip address.
app.use("/", (req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next()
});


// Sends index.html when "/" path is entered into the browser.
const absolutePath = __dirname + '/views/index.html'
app.get("/", (req, res) => {
    res.sendFile(absolutePath);
});


// Allows for the '/public' URL to be visible.
const absolutePublicPath = __dirname + '/public'
app.use("/public", express.static(absolutePublicPath));


// Converts the helloJson object into a JSON file that can be served on "/json"
// If MESSAGE_STYLE is uppercase, converts the value of all properties in this object to uppercase.
const helloJson = {"message": "Hello json"};
app.get("/json", (req, res) => {
    if (process.env.MESSAGE_STYLE === "uppercase") {
        const upperHelloJson = Object.fromEntries(
            Object.entries(helloJson).map(([key, val]) => [key, val.toString().toUpperCase()]),
        );
        res.json(upperHelloJson);
    } else {
        res.json(helloJson);
    };
});


//Returns a JSON object that contains the current time.
app.get('/now', function(req, res, next) {
    req.time = new Date().toString();
    next();
}, function(req, res) {
    let nowObj = {"time": req.time};
    res.json(nowObj);
});


// Returns the word given on the second level directory within a JSON file.
app.get('/:word/echo', function(req, res) {
    res.json({echo: req.params.word});
});


// Returns name given in URL query string as a JSON
app.get('/name', function(req, res) {
    res.json({
        name: `${req.query.first} ${req.query.last}`
    });
});


// Returns name given in POST request as a JSON
app.post('/name', function(req, res) {
    res.json({
        name: `${req.body.first} ${req.body.last}`
    })
})




 module.exports = app;
