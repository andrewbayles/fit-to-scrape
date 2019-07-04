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

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);




console.log("Hello world!");



// Routes

app.get("/", function(req, res) {
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
        
        console.log(result.headline);

        // Create a new Article using the `result` object built from scraping
        db.Articles.create(result)
          .then(function(dbArticle) {
            
            // View the added result in the console
            console.log(dbArticle);


            /*
            $("#articles").append("<p class='headline' data-id='" + dbArticle._id + "'>" + dbArticle.headline + "<br />" + dbArticle.url + "</p><p class='summary'>" + dbArticle.summary + "</p><button data-id='" + dbArticle._id + "' type='submit' value=''>Save</button>");
            */


          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });

      // For each one
      /*
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#articles").append("<p class='headline' data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].url + "</p><p class='summary'>" + data[i].summary + "</p><button data-id='" + data[i]._id + "' type='submit' value=''>Save</button>");
      }
      */
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
});


// Route for getting all Articles from the db
/*
app.get("/articles", function(req, res) {
    db.Articles.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
});
*/


// Post an article from Articles to SavedArticles.

// Post a item in Comments and associate it with an item from SavedArticles.

// Delete an item from SavedArticles.


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});