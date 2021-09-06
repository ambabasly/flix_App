const mongoose = require("mongoose");
const Models = require("./models.js");

// const Movies = Models.Movie;
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

//This allows Mongoose to connect to that database so it can perform CRUD operations on the documents it contains from within your REST API
mongoose.connect("mongodb://localhost:27017/myFlix_AppDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const express = require("express");
(morgan = require("morgan")),
  (bodyParser = require("body-parser")),
  (uuid = require("uuid"));
//methodOverride = require('method-override');

const app = express();

const myLogger = (req, res, next) => {
  console.log("Request URL: " + req.url);
  next();
};
// Logging middleware
app.use(morgan("common"));

// For the sending of static files
app.use("/documentation", express.static("public"));

// Using body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Importing auth.js and passport
let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

// Welcome message
app.get("/", (req, res) => {
  res.send("Welcome to myFlixApp");
});

//get all movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
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

//get movie by title
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

// Get all users
app.get("/users", passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get a user by username
app.get("/users/:Username", passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Add a user
app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
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
});

// Add a movie to a user's list of favorites
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
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

// Update a user's info, by username
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

app.delete(
  "/users/:ID/deactivate",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send("Successful DELETE request removing user");
  }
);

// Delete a user by username
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Delete a movie from the favorite list of a user
app.delete("/users/:Name/movies/:MovieID", passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Name: req.params.Name },
    {
      $pull: { FavoriteMovies: req.params.MovieID },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//Return a single director by name to user
app.get('/directors/:director', passport.authenticate('jwt', { session: false }), (req,res) => {
  Movies.findOne( { "Director.Name" : { $regex: req.params.director, $options: "i" } })
  .then((movie) => {
      res.json(movie.Director);
  }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
  });
});

//return a single genre by name to user
app.get("/movies/genre/:name", passport.authenticate('jwt', { session: false }), (req, res) => {
  const { name } = req.params;
  Movies.find({ 'Genre.Name' : name}).then((movies) => {
    res.json(movies);
  }).catch((err) => {
    console.error(err);
      res.status(500).send("Error: " + err);
  })
});

// allow users to deregister
app.delete("/users/:Username/movies/:MovieID",passport.authenticate('jwt', { session: false }),  (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { FavoriteMovies: req.params.MovieID } },
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
});

//Error handling
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(8081, () => {
  console.log("Your server is live and listening on port 8081.");
});
