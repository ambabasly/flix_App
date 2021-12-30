// Importing express to package
const express = require("express");

(morgan = require("morgan")),
  // middleware that lets you read from the body of HTTP request, inorder to get add info not stored in the request URL
  (bodyParser = require("body-parser")),
  // to assign a unique ID
  (uuid = require("uuid")); 

// import mongoose and our models
const mongoose = require("mongoose");
const Models = require("./models.js");

// allowing you to controll which domain has access to your API
const cors = require("cors");

const { check, validationResult } = require("express-validator");

// references to the models
const Movies = Models.Movie; 
const Users = Models.User;

const uri =
  process.env.CONNECTION_URI || "mongodb://localhost:27017/myFlix_AppDB";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/* //This allows Mongoose to connect locally to the database so it can perform CRUD operations on the documents it contains from within your REST API
mongoose.connect("mongodb://localhost:27017/myFlix_AppDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});*/

// This declares a variable that encapsulates Express’s functionality
const app = express();

app.use(cors());

const myLogger = (req, res, next) => {
  console.log("Request URL: " + req.url);
  next();
};

// Logging middleware, telling the app to use the middleware funtions for all requests
app.use(morgan("common")); // here specifies that requests should be logged using Morgan’s “common” format

app.use(bodyParser.json()); // Using body-parser
app.use(bodyParser.urlencoded({ 
    extended: true 
  })
);

let auth = require("./auth")(app); // Importing auth.js and passport
const passport = require("passport");

require("./passport");

/**
 * get:
 * summary: welcome page
 * description: send you to the landing page
 */
app.get("/", (req, res) => {
  // Welcome message
  res.send("Welcome to myFlixApp Database");
});

/**
 *@function get All Movies
 *@description get All movies from the database
 *@returns {JSON} JSON object of all movies, each of which contain the movie's title, description, director, genre, image url, and featured status.
 */
app.get(
  "/movies",
  /*passport.authenticate("jwt", { session: false }),*/
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @function getMovieByTitle
 * @description Gets the data about a single movie, by title
 * @returns {JSON} JSON object the movie that contains title, description, director, genre, image url, reviews and featured status.
 */
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);
/**
 * @getDirector
 * @description Gets the data about a director
 * @returns {JSON} JSON object with the name and bio data of the director
 */
app.get(
  "/directors/:director",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({
      "Director.Name": { $regex: req.params.director, $options: "i" },
    })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @function getGenre
 * @description Gets the description of a genre by Genres Name
 * @returns {JSON} JSON object the genre and description.
 */
app.get(
  "/genre/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { name } = req.params;
    Movies.find({ "Genre.Name": name })
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @function getUsers
 * @description Gets the users list
 * @returns {JSON} JSON object of all users, each of which contain username, email, id, favorite movies, and birthday.
 *
 */
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @function GetsUserByName
 * @description get user by username
 * @returns {JSON} JSON object of all users, each of which contain username, email, id, favorite movies, and birthday.
 */
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @function registerUser
 * @description Register/Add a user
 * @augments userData
 * @returns {JSON} JSON object of all users, each of which contain username, email, id, favorite movies, and birthday.
 */

/*expect JSON in this format 
  {
    ID: Integer,
    Username: String, 
    Password: String,
    Email: String, 
    Birthday: Date}
 */
app.post(
  "/users/registration",
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * * @function updateUserData
 * @description Update the username
 * @returns {JSON} JSON object of all users, each of which contain username, email, id, favorite movies, and birthday.
 * */

/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 *
 * @function sendReview
 * @description Add a movie to a user's list of favorites
 * @returns {JSON} JSON object with review, reviewId, userId and rating
 */
app.post(
  "/users/:Username/Movies/:movieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.movieID },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * @function unsubscribe
 * @description Allow users to remove a movie from their list of favorites
 * @returns message "user was deleted" or "user was not found"
 */
 app.delete(
  "/users/:username/Movies/:movieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.username },
      { $pull: { FavoriteMovies: req.params.movieID } },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * @function unsubscribe
 * @description Allow existing users to deregister
 * @returns message "user was deleted" or "user was not found"
 */
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was successfully deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// For the sending of static files
app.use(express.static("./public"));

//Error handling
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Something went wrong!");
});

// Listen for requests
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
