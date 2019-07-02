var express = require("express");
//var logger = require("morgan");
var mongoose = require("mongoose");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

// Use morgan logger for logging requests
//app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);




console.log("Hello world!");



// Routes

app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.vox.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Get every div containing an article, and:
      $("div.c-entry-box--compact__body").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.headline = $(this)
          .children("a")
          .text();
        result.summary = $(this)
          .children("p")
          .text();
        result.url = $(this)
          .children("a")
          .attr("href");
        
        // Create a new Article using the `result` object built from scraping
        db.Articles.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
});



// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    db.Articles.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
});





// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});