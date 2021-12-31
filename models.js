// Translating between your Node.js application and your MongoDB database layer.
const mongoose = require("mongoose");

//to hash users passwords
const bcrypt = require("bcrypt");

// define a mongose schema
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Desription: { type: String, required: true },
  Genre: {
    Name: String,
    Desription: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Actor: String,
  ImagePath: String,
  Featured: Boolean,
});

// User Schema
let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

// this method hashses a new user's password
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

//this method hashes a password on login to compare to the stored hashed password
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

// Create the models that will be used in the index.js to interact with the database
let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
