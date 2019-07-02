var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
var ArticleSchema = new Schema({
  headline: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

// Create the model from the above schema, using mongoose's model method
var Articles = mongoose.model("Articles", ArticleSchema);

// Export the Article model
module.exports = Articles;